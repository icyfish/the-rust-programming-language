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

### Adding Useful Functionality with Derived Traits