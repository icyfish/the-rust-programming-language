
<!-- TOC -->

- [理解所有权](#%E7%90%86%E8%A7%A3%E6%89%80%E6%9C%89%E6%9D%83)
	- [什么是所有权](#%E4%BB%80%E4%B9%88%E6%98%AF%E6%89%80%E6%9C%89%E6%9D%83)
		- [所有权的规则](#%E6%89%80%E6%9C%89%E6%9D%83%E7%9A%84%E8%A7%84%E5%88%99)
		- [变量的作用域](#%E5%8F%98%E9%87%8F%E7%9A%84%E4%BD%9C%E7%94%A8%E5%9F%9F)
		- [String 类型](#string-%E7%B1%BB%E5%9E%8B)
		- [内存与分配](#%E5%86%85%E5%AD%98%E4%B8%8E%E5%88%86%E9%85%8D)
		- [变量和数据交互的方式: 移动](#%E5%8F%98%E9%87%8F%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E4%BA%92%E7%9A%84%E6%96%B9%E5%BC%8F-%E7%A7%BB%E5%8A%A8)
		- [变量和数据交互的方式: 克隆](#%E5%8F%98%E9%87%8F%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E4%BA%92%E7%9A%84%E6%96%B9%E5%BC%8F-%E5%85%8B%E9%9A%86)
		- [只存储在栈上的数据: 拷贝](#%E5%8F%AA%E5%AD%98%E5%82%A8%E5%9C%A8%E6%A0%88%E4%B8%8A%E7%9A%84%E6%95%B0%E6%8D%AE-%E6%8B%B7%E8%B4%9D)
		- [所有权和函数](#%E6%89%80%E6%9C%89%E6%9D%83%E5%92%8C%E5%87%BD%E6%95%B0)
		- [返回值和作用域](#%E8%BF%94%E5%9B%9E%E5%80%BC%E5%92%8C%E4%BD%9C%E7%94%A8%E5%9F%9F)
	- [引用与借用](#%E5%BC%95%E7%94%A8%E4%B8%8E%E5%80%9F%E7%94%A8)
		- [可变的引用](#%E5%8F%AF%E5%8F%98%E7%9A%84%E5%BC%95%E7%94%A8)
		- [悬垂引用](#%E6%82%AC%E5%9E%82%E5%BC%95%E7%94%A8)

<!-- /TOC -->
## 4. 理解所有权

所有权在 Rust 中是最特别的特性, 也深刻地影响其他语言. 这个特性使得 Rust 在不需要垃圾回收机制的情况下能够更加安全地处理内存, 因此了解所有权的工作机制很重要. 本章会探讨所有权和其他相关的特性: borrowing, slices 以及 Rust 如何在内存中处理数据.

### 4.1 什么是所有权

所有权是 Rust 程序管理内存的一系列规则. 所有程序在执行时都需要对计算机的内存进行控制. 有些编程语言中存在垃圾回收机制, 当程序运行时会不断寻找未被使用的内存, 而在某些其它编程语言中, 开发者必须自己去操作分配和释放内存. Rust 使用的是第三种方式: 内存通过系统的所有权以及编译器的一系列规则进行控制. 如果任何规则被打破, 程序就不会被成功编译. 可以放心的是, 所有权的特性不会拖慢程序运行的速度.

因为所有权对许多开发者来说是一个全新的概念, 所以需要花时间进行了解. 好消息是, 当我们对 Rust 的使用经验更丰富, 对所有权的规则越熟悉之后, 就能够更容易地写出安全有效的代码.

当我们理解了所有权的概念之后, 就会对 Rust 中的许多特性有更深刻的理解, 也正是这些特性使得 Rust 在编程语言中变得特别. 本章我们会通过一些示例来学习所有权的概念, 这些示例都围绕一个很常见的数据结构: `string` 展开. 


---

**栈和堆:**

在一些编程语言中, 我们无需考虑堆栈的概念. 但是在像 Rust 这样的系统编程语言中, 值被存储在栈中还是堆中对语言的行为有比较大的影响, 同时也会左右开发者如何去编写代码. 本章中关于所有权的一部分阐释, 会与堆栈的概念有所关联, 因此我们要事先了解什么是堆和栈.

栈和堆都是内存的一部分, 当我们的代码在运行时, 会用到它们. 不过栈与堆的结构有所不同. 我们按顺序在栈中存储数据, 然后以相反的顺序取出这些数据. 这个行为被称作是: **后进先出** (_last in, first out_). 想象一叠盘子, 当我们要添加更多盘子时, 会将它们置于顶部, 取出时也是从顶部取出. 添加和取出的操作都必须在顶部完成. 添加数据的行为被称作是: **进栈** (_pushing onto the stack_), 取出数据的行为则是: **出栈** (_popping off the stack_). 所有存在栈中的数据都需要有一个已知, 固定的大小. 如果数据的大小在编译阶段是未知或者实时可变的, 就应该存储在堆中.

堆相比栈来说, 组织性更差. 当我们在堆中存储数据的时候, 需要请求特定大小的空间. 内存分配工具会在堆中找一个尽可能大的未被使用的空间, 将其标志为已使用, 并返回一个 **指针**(_pointer_), 表示该空间的具体位置. 这个过程叫做: **在堆中分配内存** (_allocating on the heap_), 有时候被简称为 **分配** (_allocating_). 存储数据到栈中的操作不是分配. 由于堆所对应的指针大小已知且固定, 指针本身是被存储在栈中的, 不过当我们需要实际的数据时, 就需要去访问指针. 想象我们在餐厅就餐, 进入餐厅时我们会事先说明就餐人数, 之后服务员会带大家去到合适的空桌中. 如果某个人迟到了, 他也可以通过桌号找到目标位置.

入栈比在堆上分配内存更快, 因为在入栈的操作中, 内存分配器不需要去搜索数据存储在哪里, 存储的位置始终是栈顶. 同时两者相比, 在堆中分配内存需要更多的工作, 因为分配器首先要找到一个足够大的空间来存储数据, 然后进行一些记录, 为下一次分配做准备.

从堆中获取数据比从栈中获取数据更慢, 因为首先要访问指针. 对于当下的处理器来说, 在内存中跳转频次越少, 处理速度就越快. 继续同样的类比, 想象餐厅服务员要处理多个餐桌的点单. 最有效的方式是在一个餐桌中获取完成所有点单之后再去到下一个餐桌. 如果从餐桌 A 获取一部分点单之后, 又去到餐桌 B 获取一部分点单, 然后返回 A 继续获取点单, 接着去 B 餐桌, 这样的过程就会很慢很繁琐. 因此同样地, 当处理器需要处理的数据与其他数据位置比较近的时候, 处理器的工作就能更高效. 分配堆中的一大部分空间也会消耗比较多的时间.

当我们的代码调用一个函数时, 值被传入函数中(这个值也可能包括指向堆中数据的指针)并且函数中的本地变量被压入栈中. 当函数执行结束, 这些值又被移出栈. 

记录哪部分的代码在使用堆中的数据, 尽量减少在堆中存储重复的数据, 清除堆中未被使用的数据, 避免使用太多的空间, 这些都是所有权需要处理的问题. 一旦你理解了所有权的概念, 你就不需要考虑太多堆和栈了. 不过, 知道了所有权的最主要目的是处理堆数据, 能够帮助我们更好地理解所有权的工作机制.

---

#### 所有权的规则

首先我们来看看所有权的规则. 记住这些规则, 在我们使用示例阐述所有权概念的时候, 这些规则会很有用:

- 在 Rust 中, 每一个值都存在一个对应的变量, 这个变量叫做 **所有者** (_owner_).
- 一个值在一个阶段只能存在一个所有者.
- 当所有者离开作用域之后, 该值也同时被丢弃.


#### 变量的作用域

现在我们已经了解了 Rust 的基本语法, 在后续的代码示例中, 就不会再添加 `fn main() {` 这部分代码了, 因此需要注意在仿照示例时, 确保你的代码中添加了这部分代码. 这样做的原因是能够使得我们的示例代码更加简洁, 我们只需要关注应该关注的细节就可以, 不需要理会对于阐释没有帮助的部分.

在第一个所有权例子中, 我们关注一些变量的`作用域`. 作用域指的是, 一个项(item)在程序中有效的范围. 查看以下示例:

```rust
let s = "hello";
```

变量`s`绑定到了一个字符串字面量值, 这个字符串值被硬编码进了我们的程序代码中. 这个变量从开始声明直到当前 _作用域_ 结束, 都是有效的. 以下代码示例中的注释说明了变量 `s` 在程序的哪个位置是有效的.

```rust
fn main() {
    {                      // s 还未被声明, 因此在这里不合法 
        let s = "hello";   // s 在这里开始合法

        // 可以在这里开始对 s 进行操作
    }                      // 作用域结束, s 不再合法
}
```

换句话说, 这里有两个重要的时间点:

- 当 `s` 进入作用域之后, 它就合法了.
- 这一过程持续直到当前作用域结束.

在这种情况下, 作用域和变量的关联关系和在其他编程语言上无异. 现在我们开始通过 `String` 类型的示例来进行详细的阐释.

#### `String` 类型

为了更好地解释所有权的概念, 我们需要一种比第三章中讲到的更复杂的数据类型. 之前我们提到的数据类型都是已知大小的, 可以被存储在栈中, 当作用域结束之后又被弹出栈. 如果代码的另一部分需要在不同的作用域使用相同的值, 这类数据类型能够能够被迅速且轻易地复制以创建一个独立的实例. 但现在我们要开始把目光放在存储在堆中的数据, 探究 Rust 如何知道何时要清除数据, `String` 类型数据很适合用来进行阐述.

我们会重点关注 `String` 中与所有权相关的部分. 这些部分在其他复杂类型中同样适用, 无论是语言本身内置的复杂类型, 还是用户自己创建的复杂类型. 在第 8 章中我们还会深入探讨 `String` 类型.

我们之前已经了解过字符串字面量, 也就是被硬编码到程序中的字符串值. 字符串字面量使用很方便, 但是并不适合所有使用文本的场景. 一个原因是字符串字面量不可变. 另一个原因是当我们在编写程序时, 并不一定每次都预先知道字符串的值是什么: 举个例子: 保存用户输入的字符串. 对于这些场景, Rust 会使用另一种字符串类型: `String` 来处理. 这种类型用以处理分配在堆中的数据, 并且能够存储在编译阶段未知大小的文本数据. 我们可以使用 `String` 提供的 `from` 方法来创建这种类型的字符串数据, 如:

```rust

#![allow(unused)]
fn main() {
let s = String::from("hello");
}
```

两个冒号的符号 `::` 使得我们能够直接使用 `String` 类型的命名空间下特定的方法 `from`, 而不需要使用另一种类似 `string_from` 的名称. 在第五章我们会对这种语法进行更深入的探讨, 在第七章, 我们则会探讨模块的命名空间.

这种类型的字符串是可变的:

```rust
fn main() {
    let mut s = String::from("hello");

    s.push_str(", world!"); // push_str() appends a literal to a String

    println!("{}", s); // This will print `hello, world!`
}

```

这里有什么不一样呢? 为什么 `String` 类型可变但是字符串字面量不可以呢? 区别是这两种类型处理内存的方式.

#### 内存与分配

对于字符串字面量, 我们在编译阶段就知道它的具体内容, 这些文本直接被硬编码到最后的执行文件中. 这也是为什么字符串字面量处理起来更快更有效的原因. 这些特性都来源于字符串的不可变特性. 不幸的是, 我们没有办法为了每一个在编译阶段大小未知的文本而将一块内存放入二进制文件中, 而且文本的大小还有可能随着程序的执行而变化.

对于 `String` 类型, 为了支持文本本身和大小的可变性, 我们需要在堆中分配一块编译阶段未知的内存来存储这些内容. 这意味着:

- 必须在运行时向内存分配器请求内存.
- 当我们处理完 `String` 之后, 需要能够将内存返回给分配器.

第一部分是要开发者自己实现的: 当我们调用 `String::from` 的时候, 它的实现会请求它所需的内存. 这在编程语言中很常见.

然而, 第二部分则有所不同. 在存在垃圾回收机制的编程语言中, 垃圾回收器会不断搜索并回收未被占用的内存, 开发者不需要考虑太多. 在大部分不存在 GC 的语言中, 考虑释放内存的任务就到了开发者的身上了. 但一直以来, 处理内存的问题对开发者来说都比较困难, 如果我们忘记处理, 就会浪费内存. 如果太快释放内存则程序就会出现一个不合法变量. 如果重复操作也会导致 bug. 我们为每一次分配 (`allocate`) 操作都对应一个释放的操作 (`free`).

Rust 所采用的是另外一种完全不同的方式: 当变量离开当前作用域之后, 内存就会自动被释放. 下面是我们使用 `String` 而非字符串字面量的作用域示例:

```rust
fn main() {
    {
        let s = String::from("hello"); // s 在这里开始被声明
        // 我们能够使用 s
    }                                  // 作用域在此结束, s不再合法
}
```

`s` 所占用的内存被释放的位置十分自然: 当 `s` 离开作用域的时候. 当一个变量离开作用域, Rust 就会为我们调用一个特别的函数. 这个函数是 [`drop`](https://doc.rust-lang.org/std/ops/trait.Drop.html#tymethod.drop), 在这里, 我们可以释放 `String` 所指变量所占用的内存. 在函数体最后, Rust 自动调用 `drop` 方法.

**注意:** 在 C++ 中, 在某个项目的生命周期结束释放内存的模式被称作是: **资源获取即为初始化**(_RAII_). 如果你了解过这个模式, 那么对 Rust 中的 `drop` 函数也不会太陌生.

这个模式对 Rust 代码如何编写有比较深的影响. 现在看可能会觉得很简单, 但是在复杂场景下, 比如在堆中分配多个变量, 我们就很难预估代码的行为. 现在我们开始探索复杂场景:

#### 变量和数据交互的方式: 移动

在 Rust 中, 多个变量与相同的数据交互, 有多种方式. 现在我们看一个使用整型的示例:

```rust
fn main() {
    let x = 5;
    let y = x;
}
```

我们大概能够猜到以上的代码做了什么: 绑定值 `5` 到变量 `x` 中; 然后创建这个值的拷贝, 将拷贝绑定到 `y` 中. 现在我们有了两个变量: `x` 和 `y`, 并且它们的值都是 `5`. 真实情况也是这样, 因为整型是简单的变量类型, 而且大小已知, 因此这两个值都被推到了栈中.

现在我们看, 如果是 `String` 类型的变量, 会发生什么:

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
}
```

以上两个示例看起来很类似, 我们或许会在直觉上认为内部发生了同样的事情, 第二行的代码进行了拷贝值的操作. 但是实际上并不是这样.

看图表4-1可以发现实际上发生了什么. `String` 由三部分组成(下图左), 指向值所在内存区域的指针, 长度, 以及容量. 这一组数据存储在栈中. 右边则是存放在堆中的具体值.

![4-1](../imgs/trpl04-01.svg)


长度表示 `String` 的内容当前使用了多少字节的内存. 容量则是分配器给 `String` 分配了多少字节的内存. 了解长度与容量的区别十分重要, 但是在我们目前的场景下, 可以忽略容量.

当我们将 `s1` 赋值给 `s2`, `String` 数据被拷贝, 但其实拷贝的只是存储在栈中指针, 长度和容量, 并没有拷贝存储在堆中的真实数据. `s1`, `s2` 的内容是下面这样的:

![4-2](../imgs/trpl04-02.svg)

数据的表示并非如下图, 如果是下图这样的话, 那么 `s2 = s1` 的操作, 在内容比较大的情况下就很消耗性能.

![4-3](../imgs/trpl04-03.svg)

早先, 我们说到当变量离开作用域之后, Rust 就会自动调用 `drop` 函数, 同时为变量清理堆中的内存. 但是图表4-2却显示两部分的指针都指向同样的位置. 这时问题就来了, 当 `s1` 和 `s2` 离开作用域的时候, 它们都会试图释放同一块内存区域. 用专业术语描述就是: **二次释放** _(double free)_ 错误, 也是我们先前提到过的内存安全性 bug 之一. 重复释放内存的操作会导致内存污染, 导致潜在的安全性问题.

为了确保内存的安全, `let s2 = s1` 这行代码执行结束之后, Rust 会将 `s1` 置为无效. 这样的话, 当 `s1` 离开当前作用域, Rust 就不需要考虑释放内存. 因此以下代码会报出异常:

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;

    println!("{}, world!", s1);
}
```

以上代码会报出异常, 因为 Rust 会阻止我们使用不合法的引用:

```shell
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0382]: borrow of moved value: `s1`
 --> src/main.rs:5:28
  |
2 |     let s1 = String::from("hello");
  |         -- move occurs because `s1` has type `String`, which does not implement the `Copy` trait
3 |     let s2 = s1;
  |              -- value moved here
4 | 
5 |     println!("{}, world!", s1);
  |                            ^^ value borrowed here after move

For more information about this error, try `rustc --explain E0382`.
error: could not compile `ownership` due to previous error
```

如果你在其它编程语言中听过 **浅拷贝** (_shallow copy_) 和 **深拷贝** (_deep copy_), 拷贝指针, 长度和容量, 不拷贝值本身的行为和浅拷贝听起来很类似. 但是因为 Rust 同样也将第一个变量置为无效了, 所以并没有把这个行为定义为浅拷贝, 而是 **移动**(_move_). 在本例中, `s1`(的值)被移动到了 `s2`. 用图表呈现就是这样的:

![4-4](../imgs/trpl04-04.svg)

这就解决了我们的问题. 由于只有 `s2` 是合法的, 当它离开作用域的时候, 只有 s2 释放了内存.

除此之外, 这里还暗含了一个 Rust 内部的设计意图: Rust 不可能会自动对数据进行深拷贝. 因此, 任何**自动拷贝**的操作对性能的影响都并不大.

#### 变量和数据交互的方式: 克隆

如果我们想要对 `String` 所对应的堆中的值进行拷贝, 不只是栈中值的话, 我们可以用一个公用方法 `clone`. 在第五章中我们会对方法的语法进行讨论. 但是由于方法在许多编程语言中是比较常见的特性, 你或许在之前就已经了解过.

下面是 `clone` 方法的实例:

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();

    println!("s1 = {}, s2 = {}", s1, s2);
}
```

以上的代码就能够正常工作, 并且行为和图表4-3所表示的一致, 堆中的数据被拷贝.

当调用 `clone` 时, 某些代码确实被执行且对性能有较大的损耗, 也能够通过 `clone` 看出来一些特别的事情正在发生.

#### 只存储在栈上的数据: 拷贝

还有一点我们没有提到的是. 使用整型的代码, 拷贝的过程就如图表4-2所示:

```rust
fn main() {
    let x = 5;
    let y = x;

    println!("x = {}, y = {}", x, y);
}
```

但以上代码好像和我们之前所了解到的内容相违背了: 我们并没有调用 `clone` 方法, 但是 `x` 始终是合法的而且并没有被移动至 `y`.

原因是, 某些类型(如整型)在编译阶段大小已知, 并且全部存储在栈中, 所以对实际数据的拷贝很容易就实现. 这样的话, 当我们创建 `y` 变量之后, 就无需将 `x` 置为无效了. 也就是说, 对于这些类型来说, 无需区分深拷贝和浅拷贝, 是否调用 `clone` 都不会有差别.

Rust 有一个特别的特性: `Copy` 方法, 这个方法存在于存储于栈中的数据类型(比如整型)中, 我们会在第十章对方法(trait)进行详细的介绍. 如果一个类型内置了 `Copy` 方法, 那么一个变量在赋值给另一个变量之后, 原变量依然是合法的. 对于实现了	 `Drop` 的类型, Rust 不会允许再实现 `Copy`. 如果某个类型的变量在离开作用域之后需要进行一些特殊的处理, 但我们为其实现了 `Copy` 方法的话, 就会遇到编译器错误. 在附录 C - [实现可派生特性](https://doc.rust-lang.org/book/appendix-03-derivable-traits.html)中, 我们可以了解到如何为某个类型的值添加 `Copy` 方法.

那么哪些类型本身实现了 `Copy` 方法呢? 我们可以通过查看各个类型的文档来确定, 不过有一个基本的规则就是, 任何一组简单标量值的组合都可以实现 `Copy`, 不需要分配内存的类型或者属于特定形式资源的类型也可以实现 `Copy`. 下面列举了能够实现 `Copy` 方法的类型:

- 所有整型, 比如 `u32`
- 布尔类型: `bool`, 值为 `true` 或者 `false`
- 所有浮点数类型, 比如 `f64`
- 字符类型, `char`
- 元组类型, 不过需要确保其中的每一项都实现了 `Copy`. 比如 `(i32, i32)`, 两项都实现了 `Copy`, 但是 `(i32, String)` 就不.

#### 所有权和函数

在函数中传参与为变量赋值的语法类似. 给函数传递参数会进行移动(move)或者拷贝(copy)的操作, 和赋值进行的操作是一致的. 代码示例4-3在注释中详细说明了变量在哪个位置进入和离开作用域.

```rust
fn main() {
    let s = String::from("hello");  // s 进入作用域

    takes_ownership(s);             // s 的值被移动到函数中
                                    // 函数执行结束之后被 drop, 在这里就不合法了 

    let x = 5;                      // x 进入作用域

    makes_copy(x);                  // x 的值被移动到函数中
                                    // 因为类型是 i32, 所以是 Copy, 因此 x 变量始终存在

} 
// x 在这里离开作用域, 然后是 s, 因为 s 的值被 move, 所以没有什么特别的事情发生


fn takes_ownership(some_string: String) { // some_string 进入作用域
    println!("{}", some_string);
} // some_string 在这里离开作用域, `drop` 被调用. 所占用的内存被释放

fn makes_copy(some_integer: i32) { // some_integer comes into scope
    println!("{}", some_integer);
} // some_integer 在这里离开作用域
```

如果调用 `takes_ownership` 之后再使用 `s` 编译器会报错, 静态检查会免于我们碰到错误. 可以添加代码到 `main` 函数中, 尝试使用 `s` 和 `x` 以确认你能够在哪里使用他们, 所有权规则是如何限制使用的.

#### 返回值和作用域

从函数中返回值同样能够转移所有权. 代码示例4-4中的, 展示了返回某个值的函数示例, 同样这里也对每一行关键代码添加了注释.

```rust
fn main() {
    let s1 = gives_ownership(); // gives_ownership 将其返回值 move 给 s1 

    let s2 = String::from("hello"); // s2 进入作用域

    let s3 = takes_and_gives_back(s2); // s2 被 move 到 takes_and_gives_back, 同时函数返回值被 move 给 s3

} // s3 在这里跳出作用域, 然后被 drop, s2 被 move, 因此无事发生. s1 跳出作用域然后被 drop 

fn gives_ownership() -> String {
    // 调用 gives_ownership 会 move 返回值

    let some_string = String::from("yours"); // some_string 进入作用域

    some_string // some_string 被返回 
}

// 该函数接受一个 String, 然后返回它 
fn takes_and_gives_back(a_string: String) -> String {
    // a_string 进入作用域

    a_string // a_string 被返回并被 move 出
}
```

变量的所有权每次都遵循同样的模式: 将值赋给所 move 的变量. 当包含栈数据的变量跳出作用域之后, `drop` 之后值就会被释放, 除非数据的所有权被转移给另一个变量.

尽管如此, 通过函数获取控制权和返回控制权依然有点复杂. 如果我们想要让函数使用某个值, 但是不获取控制权, 应该怎么做呢? 如果所有值都需要传入传出使用的话, 难免有些繁琐. 除此之外, 我们还会想从函数中返回某些我们所想要的数据.

对于这种情况, Rust 允许我们使用元组 (tuple) 类型来返回多个值, 看代码示例4-5:

```rust
fn main() {
    let s1 = String::from("hello");

    let (s2, len) = calculate_length(s1);

    println!("The length of '{}' is {}.", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len(); // len() 返回 String 的长度值

    (s, length)
}
```

但这还是太形式主义了, 一个常用的场景, 实现起来却需要耗费那么大精力. 还好 Rust 提供了另一个特性, 我们不需要手动获取使用权, 就能够使用值, 这个特性叫做 **引用** (_reference_).


### 4.2 引用与借用

在代码4-5中关于元组的示例代码, 存在一个问题: 我们必须将 `String` 返回给调用函数, 这样在调用 `calculate_length` 的时候, 我们才能够使用 `String`, 因为 `String` 被移动到了 `calculate_length` 中. 除了这种方式, 我们可以提供 `String` 值的引用. **引用**(_reference_)和指针有点类似, 同样存储了一个内存地址, 我们能够通过这个地址去读取存储在其他变量中的数据. 但和指针不同的是, 引用必须要确保指向某个特定类型的有效值. 下面的示例, 说明了我们应该如何定义并使用 `calculate_length` 函数, 该函数的参数是对象的引用, 而不是获取值的所有权:

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

**注意:** 与使用 `&` 引用相反的操作是 **解引用** (_dereferencing_), 通过符号 `*` 实现. 我们会在第八章中看到一些解引用的示例, 在第15章中探讨解引用的细节.

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

同样地, 函数签名使用 `&` 来表名 `s` 是一个 引用. 现在我们来开始添加一些注释:

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

现在我们开始修改4-6的代码, 对所借用的变量进行一些简单地修改, 将引用变成**可变引用**(_mutable reference_):

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

首先, 我们给 `s` 添加 `mut` 标识. 然后在调用 `change` 函数的时候通过 `&mut s` 创建一个可变引用, 并且更新函数签名, 以接受一个可变引用`some_string: &mut String`. 显而易见的是, `change` 函数会改变所借用的值.

但可变引用有一个比较大的缺陷: 对于某一部分特定的数据, 一次只能存在一个可变引用. 下面的代码试图为 `s` 创建两个可变引用, 会抛出错误:

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

报错显示这段代码是无效的, 因为我们不能进行重复的可变借用. 第一次可变借用发生在 `r1`, 它的生命周期必须持续到在 `println!` 中, 但在可变引用的创建与使用过程中间, 我们在 `r2` 中又创建了一个可变引用, 与 `r1` 借用的是同样的数据.

The restriction preventing multiple mutable references to the same data at the same time allows for mutation but in a very controlled fashion. 刚接触 Rust 的朋友可能会很不习惯这一点, 因为在大部分其他语言中, 变量都是可变的. 这个限制的好处是 Rust 能够在编译阶段避免数据竞争. **数据竞争** (_data race_) 和竞态条件很相似, 当以下三个行为出现时, 就会产生数据竞争:

- 2个及以上的指针同时去读取同样的数据.
- 至少1个指针被用于写入数据.
- 没有同步数据访问的机制

数据竞争很可能导致未被定义的行为, 难以在运行时追踪, 而且很难被发现和修复; Rust 会通过拒绝编译含有数据竞争的代码来避免这个问题!

一如往常, 我们可以使用大括号来创建一个新的作用域, 以允许多个可变引用, 只是不能 **同时** 拥有:

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

我们同样不能在拥有不可变引用的同时拥有可变引用. 不可变引用的用户并不希望看到值突然变化. 不过, 多个不可变引用还是被允许的, 因为单纯的读取数据, 不可能会影响到其它人进行数据的读取.

注意, 一个引用的作用域从声明时开始, 持续到最后一次使用为止. 比如, 一下代码就能够被成果编译, 因为最后一次`println!`中对不可变数据的引用发生在可变引用之前:

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

不可变引用的作用域在 `println!` 之后就终止了, 终止的过程在可变引用 `r3` 被创建之前. 这些作用域不存在重叠的部分, 因此代码是被允许的. 编译器在作用域结束之前判断不再使用的引用的能力被称为 **非词法作用域生命周期** (_Non-Lexical Lifetimes_, 简称 NLL). 可以在[版本指引](https://blog.rust-lang.org/2018/12/06/Rust-1.31-and-rust-2018.html#non-lexical-lifetimes)中了解更多信息.

尽管借用的抛错有时候会让人很困扰, 但是其实这是 Rust 编译器提前指出潜在bug(在编译阶段而非运行时), 抛出问题. 有这样的机制, 我们就无需再费力去追踪为什么我们的数据与预期的不一致了.

#### 悬垂引用

在存在指针概念的语言中, 我们可能会很容易地创建**悬垂指针** (_dangling pointer_): 