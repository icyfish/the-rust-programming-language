[[toc]]

## 5.2 使用结构体的示例程序

为了更好地理解何时使用结构体, 我们来编写一个程序, 这个程序的功能是计算一个长方形的面积. 初版本先使用单独的变量, 然后开始重构程序, 直到使用结构体来替代单独的变量为止.

首先用 Cargo 创建一个新的二进制项目, 将其命名为 _rectangles_, 该程序接收以像素为单位的宽度和高度值, 程序根据这两个值计算出长方形的面积. 代码示例5-8就实现了这一功能:

```rust
fn main() {
    let width1 = 30;
    let height1 = 50;

    println!(
        "The area of the rectangle is {} square pixels.",
        area(width1, height1)
    );
}

fn area(width: u32, height: u32) -> u32 {
    width * height
}
```

现在执行 `cargo run` 来运行程序:

```shell
$ cargo run
   Compiling rectangles v0.1.0 (file:///projects/rectangles)
    Finished dev [unoptimized + debuginfo] target(s) in 0.42s
     Running `target/debug/rectangles`
The area of the rectangle is 1500 square pixels.
```

代码通过调用 `area` 函数确实获取了我们想要的结果, 但我们可以对其进行进一步优化使得代码更加清晰可读:

代码中的问题很明显出现在 `area` 的函数签名中:

```rust
fn main() {
    let width1 = 30;
    let height1 = 50;

    println!(
        "The area of the rectangle is {} square pixels.",
        area(width1, height1)
    );
}

fn area(width: u32, height: u32) -> u32 {
    width * height
}
```

`area` 函数支持计算一个长方形的面积, 但是该函数接收两个参数, 但我们的程序代码中并没有清晰地体现出这两个参数的关联. 如果宽度和高度是在一个集合中的话, 代码的可读性就会更高, 也更容易管理. 优化的其中一种方式是使用元组, 我们在第三章的[元组类型](https://doc.rust-lang.org/book/ch03-02-data-types.html#the-tuple-type)章节已经对元组做过介绍.

### 使用元组进行重构

代码示例5-9展示了用元组实现的另一个版本:

```rust
fn main() {
    let rect1 = (30, 50);

    println!(
        "The area of the rectangle is {} square pixels.",
        area(rect1)
    );
}

fn area(dimensions: (u32, u32)) -> u32 {
    dimensions.0 * dimensions.1
}
```

在某种程度上, 这个版本的程序更好一些. 使用元组使得代码更加结构化, 我们的函数也只需接受一个参数即可. 但从另一方面看, 这个版本代码其实更不清晰: 由于是元组中的元素, 无法对其进行命名, 因此我们必须使用索引来获取参数中的宽高值, 这样一来, 计算的代码其实含义更不清晰了.

尽管弄混宽高不会对面积的计算产生影响, 但如果我们希望在屏幕上画出这个长方形, 情况就不一样了. 此时我们就必须记住索引 `0` 是宽度, 索引 `1` 是高度. 如果别人阅读我们的代码, 就会觉得很疑惑, 因为我们没有在代码中清晰地呈现各个数据所表达的含义, 这会很容易产生错误.

### 用结构体进行重构: 让代码表达它的含义

我们利用结构体来给代码赋予含义的方式是通过给数据添加标签. 实际上就是将元组转化为结构体, 给结构体本身和其中的元素添加命名, 如代码示例5-10所示:

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        area(&rect1)
    );
}

fn area(rectangle: &Rectangle) -> u32 {
    rectangle.width * rectangle.height
}
```

这里我们定义了一个结构体并将其命名为 `Rectangle`. 在大括号中定义字段 `width` 和 `height`, 两者的类型都是 `u32`. 然后在 `main` 函数中, 我们创建一个 `Rectangle` 的实例, 其中宽度值为 30, 高度值为 50. 

我们的 `area` 函数现在只接受一个参数 `rectangle`, 其类型为结构体 `Rectangle` 实例的不可变借用. 记得我们在第四章中说到, 我们希望借用结构体而不是获取它的所有权. 这样的话, `main` 函数就能够保持对 `rect1` 的所有权并继续使用它, 这也是我们要在函数签名和函数调用的代码中使用 `&` 的原因.

`area` 函数会访问 `Rectangle` 实例的 `width` 和 `height` 字段. `area` 函数签名现在已经很清楚地呈现了我们想要表达的意思: 利用字段 `width` 和 `height` 的值, 计算 `Rectangle` 的面积. 同时函数签名也表达出了 `width` 和 `height` 之前是有关联的. 这比使用元组读取索引 `0` 和 `1` 的值含义清楚多了. 结构体的优势就在于含义清晰.

### 使用派生的 trait 添加一些有用的功能

当我们在调试程序时, 如果能够打印出 `Rectangle` 的实例并且查看实例中每一个字段的值, 对调试会有很大的帮助. 代码示例5-11中尝试使用 [`println` 宏方法](https://doc.rust-lang.org/std/macro.println.html)来达到这个目的, 但是并不像我们预期的那样输出结果:

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!("rect1 is {}", rect1);
}
```

当我们编译以上代码的时候, 会看到以下错误信息:

```
error[E0277]: `Rectangle` doesn't implement `std::fmt::Display`
```

`println` 宏能够处理多种类型的格式, 默认情况下, 使用大括号 `{}` 表示使用 `Display` 格式: 即直接输出给终端用户查看的格式. 目前我们知道的原始类型都默认实现了 `Display` 格式, 因为如果你想展示 `1` 或者其他原始类型的数据给用户, 只有一种展示方式. 不过对于结构体类型来说, `println` 所输出的默认格式就无法清晰地表达含义了, 因为结构体类型结构复杂, 所以在展示上有更多的可能性: 是否需要逗号? 是否需要打印出大括号? 是否要展示出所有字段? 由于不确定性太大, Rust 并不会尝试猜测我们的意图, 结构体类型本身也没有提供 `Display` 的实现供 `println!` 和 `{}` 占位符使用.

如果持续遇到错误, 我们可以从错误信息中找到一些可用的提示:

```
   = help: the trait `std::fmt::Display` is not implemented for `Rectangle`
   = note: in format strings you may be able to use `{:?}` (or {:#?} for pretty-print) instead
```

现在开始试试看. `println!` 宏调用现在看起来像是这样的格式: `println!("rect1 is {:?}", rect1);`. 在 `{}` 内部加上 `:?` 指示符的含义是告诉 `println!` 我们想要使用 `Debug` 类的输出格式. `Debug` trait 使得输出结构体时能够披露更多对开发者有用的信息, 帮助开发者更有效地调试代码.

现在做出些许改动. 但是依然有报错:

```
error[E0277]: `Rectangle` doesn't implement `Debug`
```

不过不用担心, 编译器输出了一些有用的信息:

```
   = help: the trait `Debug` is not implemented for `Rectangle`
   = note: add `#[derive(Debug)]` to `Rectangle` or manually `impl Debug for Rectangle`
```

Rust 确实内置了输出调试信息的功能, 但是我们必须为结构体手动开启这个功能. 具体的操作方式是: 在结构体定义之前加上外部属性 `#[derive(Debug)]`, 具体如代码示例5-12所示:

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!("rect1 is {:?}", rect1);
}
```

现在我们开始执行程序, 执行过程不会有任何错误, 然后会看到以下输出结果:


```shell
$ cargo run
   Compiling rectangles v0.1.0 (file:///projects/rectangles)
    Finished dev [unoptimized + debuginfo] target(s) in 0.48s
     Running `target/debug/rectangles`
rect1 is Rectangle { width: 30, height: 50 }
```

或许以上的输出并非最完美的结果, 但是确实展示了该结构体实例的所有字段值, 对我们的调试很有帮助. 当我们的结构体更复杂的情况下, 这样的输出就使得代码更加清晰; 在这些情况下, 我们可以考虑在 `println!` 中使用 `{:#}?` 来替代 `{:?}`. 在本例中, 使用 `{:#}?` 将会输出:

```shell
$ cargo run
   Compiling rectangles v0.1.0 (file:///projects/rectangles)
    Finished dev [unoptimized + debuginfo] target(s) in 0.48s
     Running `target/debug/rectangles`
rect1 is Rectangle {
    width: 30,
    height: 50,
}
```

另一种使用 `Debug` 格式输出值的方式是利用 [`dbg!` 宏](https://doc.rust-lang.org/std/macro.dbg.html), 该方法会接收某个表达式的所有权, 打印出代码中调用 `dbg!` 宏的代码所在文件及行号, 以及这个表达式的结果值, 并返回该值的所有权. 

::: tip 注意
调用 `dbg!` 宏的输出会存在于标准错误控制台流(`stderr`), 而 `println!` 宏的输出则存在于标准输出控制台流(`stdout`). 在[第 12 章的"写入错误信息到标准错误控制台中而不是标准输出控制台"章节](https://doc.rust-lang.org/book/ch12-06-writing-to-stderr-instead-of-stdout.html)中, 我们会讨论更多关于 `stderr` 和 `stdout` 的内容.
:::

下面的示例中, 我们会关注赋给 `width` 字段的值, 同时还有整个结构体实例 `rect1` 中的值:

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let scale = 2;
    let rect1 = Rectangle {
        width: dbg!(30 * scale),
        height: 50,
    };

    dbg!(&rect1);
}
```

我们用 `dbg!` 来输出表达式 `30 * scale` 的结果, 因为 `dbg!` 返回了这个表达式值的所有权, 此时 `width` 字段的值与 `30 * scale` 的结果无异. 我们并不希望 `dbg!` 拿走 `rect1` 的控制权, 因此在后续的函数调用中, 我们使用了 `rect1` 的引用. 以上的代码的输出大概会是下面这样:

```shell
$ cargo run
   Compiling rectangles v0.1.0 (file:///projects/rectangles)
    Finished dev [unoptimized + debuginfo] target(s) in 0.61s
     Running `target/debug/rectangles`
[src/main.rs:10] 30 * scale = 60
[src/main.rs:14] &rect1 = Rectangle {
    width: 60,
    height: 50,
}
```

输出结果的第一部分来自文件 _src/main.rs_ 的第 10 行, 在这里我们调试输出(`!dbg`)了 `30 * scale` 的值, 该表达式的最终结果是 60(为整数实现的 `Debug` 模式只会单纯打印它们的值). 在同一个文件的第 14 行中, 调用 `dbg!` 输出了 `&rect1` 的值, 也就是结构体 `Rectangle`. 此时的输出格式采用了 `Rectangle` 类型的 `Debug` 模式, 可读性更高. `dbg!` 宏对我们调试代码有很大的帮助, 特别是当我们想要搞清楚我们的代码具体做了些什么的时候.

除了 `Debug` trait, Rust 还提供了很多其他的 trait, 不过这些 trait 需要配合 `derive` 属性进行使用, 它们为我们的自定义类型额外实现了许多实用的行为. 想要了解这些 trait 以及它们的行为, 可以查看[附录 C](https://doc.rust-lang.org/book/appendix-03-derivable-traits.html). 在第 10 章中, 我们会学习如何实现这些 trait 以及自定义行为, 同时还会学习如何实现我们自己的 trait. 除了 `derive` 之外, 还有许多其他属性, 可以查看 [Rust 参考目录中的"属性"章节部分](https://doc.rust-lang.org/reference/attributes.html).

`area` 函数的行为很具体: 只计算了长方形的面积. 如果将这个函数的行为和 `Rectangle` 结构体关联起来, 它会更加实用, 因为对于其他类型来说, 这个函数其实没有任何用处. 那么接下来, 我们开始看看应该如何重构我们的代码, 将 `area` 函数转换成 `area` 方法, 使其与 `Rectangle` 函数体类型进行关联.