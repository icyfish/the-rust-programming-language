- [4.2 引用与借用](#42-引用与借用)
  - [可变的引用](#可变的引用)
  - [悬垂引用](#悬垂引用)
  - [引用的规则](#引用的规则)
### 4.2 引用与借用

在代码4-5中关于元组的示例代码, 存在一个问题: 我们必须将 `String` 返回给调用函数, 这样在调用 `calculate_length` 的时候, 我们才能够使用 `String`, 因为 `String` 被移动到了 `calculate_length` 中. 除了这种方式之外, 我们还可以提供 `String` 值的引用. **引用**(_reference_)和指针有点像, 同样存储了一个内存地址, 我们能够通过这个地址去读取存储在其他变量中的数据. 但和指针不同的是, 引用必须要确保指向某个特定类型的有效值. 下面的示例, 说明了我们应该如何定义并使用 `calculate_length` 函数, 该函数的参数是对象的引用, 而不是获取值的所有权:

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

可以发现变量声明和函数返回值的元组代码都消失了. 我们传递给 `calculate_length` 的参数是 `&s1`, 同时在函数定义中, 我们读取 `&String` 而不是 `String`. & 符号表示 **引用**, 这允许我们直接引用某个值, 而不需要通过获取所有权的方式. 图表4-5是相关的示意图.

![4-5](../imgs/trpl04-05.svg)

> 注意: 与使用 `&` 引用相反的操作是 **解引用** (_dereferencing_), 通过符号 `*` 实现. 我们会在第八章中看到一些解引用的示例, 在第15章中探讨解引用的细节.

现在我们来查看下面这个函数调用:

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

`&s1` 的语法允许我们创建一个引用, 指向 `s1` 的值, 但是并不拥有这个值. 因为并没有所有权, 所以即使停止引用, 它所指向的值也不会被丢弃.

同样地, 函数签名使用 `&` 来表明 `s` 是一个引用. 现在我们来给代码添加一些注释:

```rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize { // s 是 String 的引用
    s.len()
} // s 在这里离开作用域, 但是因为对于引用所对应的值没有所有权, 所以并没有发生什么特别的事情
```

变量 `s` 的有效作用域与函数参数的作用域一致, 唯一的区别是利用引用的 `s`, 即使停止引用, 也不会被丢弃, 因为 `s` 不存在所有权. 当函数使用引用而不是实际值作为参数时, 我们不再需要返回对应值来交还控制权, 因为始终不曾拥有控制权.

我们将创建引用的行为称为 **借用**(_borrowing_). 在现实生活中, 如果某人拥有某样东西, 我们可以向这个人借用这个东西, 当我们用完之后, 就要将其归还. 你并不拥有它.

那么当我们试图改变我们所借用的东西的时候, 会发生什么呢? 尝试4-6的代码, 剧透: 这段代码不会生效!

```rust
fn main() {
    let s = String::from("hello");

    change(&s);
}

fn change(some_string: &String) {
    some_string.push_str(", world");
}
```

当我们执行以上代码的时候, 会遇到这个报错:

```shell
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0596]: cannot borrow `*some_string` as mutable, as it is behind a `&` reference
 --> src/main.rs:8:5
  |
7 | fn change(some_string: &String) {
  |                        ------- help: consider changing this to be a mutable reference: `&mut String`
8 |     some_string.push_str(", world");
  |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ `some_string` is a `&` reference, so the data it refers to cannot be borrowed as mutable

For more information about this error, try `rustc --explain E0596`.
error: could not compile `ownership` due to previous error
```

正如变量在默认情况下是不可变的, 引用也是. Rust 不允许我们修改所引用的值.

#### 可变的引用

现在我们开始修改4-6的代码, 对所借用的变量进行一些简单的修改, 将引用变成**可变引用**(_mutable reference_):

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

首先, 我们给 `s` 添加 `mut` 可变标识. 然后在调用 `change` 函数的时候通过 `&mut s` 创建一个可变引用, 并且更新函数签名, 以接受一个可变引用`some_string: &mut String`. 这样的传参形式, 就很容易看出来 `change` 函数会改变所借用的值.

但可变引用有一个比较大的限制: 对于某一部分特定的数据, 一次只能存在一个可变引用. 下面的代码试图为 `s` 创建两个可变引用, 会抛出错误:

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &mut s;
    let r2 = &mut s;

    println!("{}, {}", r1, r2);
}
```

错误内容是这样的:

```shell
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0499]: cannot borrow `s` as mutable more than once at a time
 --> src/main.rs:5:14
  |
4 |     let r1 = &mut s;
  |              ------ first mutable borrow occurs here
5 |     let r2 = &mut s;
  |              ^^^^^^ second mutable borrow occurs here
6 | 
7 |     println!("{}, {}", r1, r2);
  |                        -- first borrow later used here

For more information about this error, try `rustc --explain E0499`.
error: could not compile `ownership` due to previous error
```

报错显示这段代码是无效的, 因为我们不能重复借用可变值. 第一次可变借用发生在 `r1`, 它的生命周期必须持续到 `println!` 中, 但在可变引用的创建之后, 与使用它的代码之前, 我们又创建了一个可变引用, 与 `r1` 借用的是同样的数据.

防止同一时间对同一数据进行多个可变引用的限制允许可变性, 不过是以一种受限制的方式允许. 刚接触 Rust 的朋友可能会很不习惯这一点, 因为在大部分其他语言中, 变量都是可变的. 这个限制的好处是 Rust 能够在编译阶段避免数据竞争. **数据竞争** (_data race_) 和竞态条件很像, 当以下三个行为出现时, 就会产生数据竞争:

- 2个及以上的指针同时去读取同样的数据.
- 至少1个指针被用于写入数据.
- 没有同步数据访问的机制

数据竞争很可能导致未被定义的行为, 难以在运行时追踪, 而且很难被发现和修复; Rust 会通过拒绝编译含有数据竞争的代码来避免这个问题!

一如往常, 我们可以使用大括号来创建一个新的作用域, 以允许多个可变引用, 只是它们不能 **同时** 存在:

```rust
fn main() {
    let mut s = String::from("hello");

    {
        let r1 = &mut s;
    } // r1 在这里离开作用域, 因此我们可以在此之后创建新的引用

    let r2 = &mut s;
}
```

Rust 在组合可变和不可变引用的时候, 也采用了类似的规则. 下面的代码会导致错误:

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s; // 没有问题
    let r2 = &s; // 没有问题
    let r3 = &mut s; // 问题很大!

    println!("{}, {}, and {}", r1, r2, r3);
}
```

具体错误信息如下:

```shell
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
 --> src/main.rs:6:14
  |
4 |     let r1 = &s; // no problem
  |              -- immutable borrow occurs here
5 |     let r2 = &s; // no problem
6 |     let r3 = &mut s; // BIG PROBLEM
  |              ^^^^^^ mutable borrow occurs here
7 | 
8 |     println!("{}, {}, and {}", r1, r2, r3);
  |                                -- immutable borrow later used here

For more information about this error, try `rustc --explain E0502`.
error: could not compile `ownership` due to previous error
```

从以上报错中可以看出来, 对于同一个值, 不能同时存在不可变引用和可变引用. 不可变引用的用户并不希望看到值突然变化. 不过, 多个不可变引用还是被允许的, 因为都是数据读取, 互相之间不会影响.

要注意的是, 一个引用的作用域从声明时开始, 持续到最后一次被使用为止. 比如, 以下代码就能够被成功编译, 因为最后一次 `println!` 中对不可变数据的引用发生在可变引用之前:

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s; // 没有问题
    let r2 = &s; // 没有问题
    println!("{} and {}", r1, r2);
    // 变量 r1 和 r2 从这里开始就不会再被使用

    let r3 = &mut s; // 没有问题
    println!("{}", r3);
}
```

不可变引用 `r1` 和 `r2` 的作用域在 `println!` 之后就终止了, 终止的时机在可变引用 `r3` 被创建之前. 这些作用域不存在重叠的部分, 因此代码是合法的. 编译器在作用域结束之前判断不再使用的引用的能力被称为 **非词法作用域生命周期** (_Non-Lexical Lifetimes_, 简称 NLL). 可以在[版本指引](https://blog.rust-lang.org/2018/12/06/Rust-1.31-and-rust-2018.html#non-lexical-lifetimes)中了解更多信息.

尽管借用的抛错有时候会让人很困扰, 但是其实这是 Rust 编译器在提前指出潜在 bug (在编译阶段而非运行时), 抛出问题. 有这样的机制, 我们就无需再费力去追踪为什么我们的数据与预期的不一致了.

#### 悬垂引用

在存在指针概念的语言中, 我们可能会很容易错误地创建**悬垂指针** (_dangling pointer_): 其指向的内存可能已经分配给其它持有者. 相比之下, 在 Rust 中, 编译器会确保引用不会成为悬垂状态: 如果代码中存在对某部分数据的引用, 编译器会确保这部分数据在其引用前始终存在于作用域中.

现在我们尝试创建一个悬垂引用来了解 Rust 是如何在编译阶段避免这个错误的:

```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String {
    let s = String::from("hello");

    &s
}
```

具体的错误信息如下:

```shell
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0106]: missing lifetime specifier
 --> src/main.rs:5:16
  |
5 | fn dangle() -> &String {
  |                ^ expected named lifetime parameter
  |
  = help: this function's return type contains a borrowed value, but there is no value for it to be borrowed from
help: consider using the `'static` lifetime
  |
5 | fn dangle() -> &'static String {
  |                ~~~~~~~~

For more information about this error, try `rustc --explain E0106`.
error: could not compile `ownership` due to previous error
```

以上错误信息还涉及到了一个我们暂未提及到的概念: 生命周期. 在第十章中我们会对这个概念进行详细的说明. 不过即使我们暂时不理会生命周期的概念, 通过以下的错误信息也能发现代码中的问题:

```shell
this function's return type contains a borrowed value, but there is no value
for it to be borrowed from
```

现在我们开始看看, 悬垂(`dangle`)代码的每一个阶段, 都发生了什么:

```rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String { // dangle 函数返回 String 的引用

    let s = String::from("hello"); // s 是一个新的 String

    &s // 我们返回 String 的引用 s
} // s 在此跳出作用域, 同时被丢弃, 所占用的内存也被释放
// 危险!

```

因为 `s` 在 `dangle` 内部被创建, 当 `dangle` 中的代码执行结束时, `s` 所占用的内存就会被释放. 不过我们在代码中返回了 `s` 的引用. 这意味着引用指向了一个不合法的 `String`, Rust 不会允许我们这样做.

此时的解决方案是直接返回 `String`:

```rust
fn main() {
    let string = no_dangle();
}

fn no_dangle() -> String {
    let s = String::from("hello");

    s
}
```

以上代码没有任何问题. 所有权被移出, 没有内存被释放.

#### 引用的规则

现在我们回顾一下之前讨论过的关于引用的概念:

- 在任何时候, 代码中要么存在一个可变引用, 要么存在多个不可变引用.
- 引用必须始终是合法的.

接下来我们开始查看另一种类型的引用: slices.