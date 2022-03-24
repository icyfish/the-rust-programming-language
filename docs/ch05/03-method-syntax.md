[[toc]]

## 方法语法

**方法**(_method_) 跟函数很像: 使用 `fn` 关键词和一个名称来声明, 同样接受参数和返回值, 并且当方法被调用时, 方法内部的代码会被执行. 不过和函数不同的是: 方法在结构体(或枚举, 或 trait 对象)的上下文中被定义. 关于枚举和 trait 对象, 我们分别会在第6章和第17章中进行详细的介绍. 通常情况下, 方法的第一个参数始终是 `self`, `self` 表示调用该方法的结构体实例.

### 定义方法

现在我们修改接受 `Rectangle` 实例作为参数的函数 `area`, 将 `area` 改成 `Rectangle` 结构体的方法, 具体代码示例见5-13:

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "The area of the rectangle is {} square pixels.",
        rect1.area()
    );
}
```

为了在 `Rectangle` 上下文中定义方法, 我们要在 `Rectangle` 前添加 `impl` 块, impl 是 implementation(实现) 的缩写. 在 `impl` 块内部所定义的所有都会与 `Rectangle` 类型关联. 之后我们将 `area` 函数移动到 `impl` 之后的大括号中, 将第一个参数修改为 `self`, 同时修改函数体中对应的内容. 在 `main` 函数中, 我们调用了 `area` 函数并传递了 `rect1` 函数作为参数, 现在我们用方法语法来替代这部分内容, 改为调用 `Rectangle` 实例中的 `area` 方法. 具体方式是在实例后加 `.`, 并跟上方法名和括号, 括号中传入所需的参数.

在 `area` 签名中, 我们使用 `&self` 而不是 `rectangle: &Rectangle`. 实际上 `&self` 是 `self: &Self` 的简写. 在 `impl` 块中, `Self` 是 `impl` 所指代类型的别名. 方法的第一个参数名必须为 `self`, 其类型为 `Self`. 因此 Rust 强制我们在方法第一个参数的位置使用 `self` 作为参数名. 同时还要注意我们要在第一个参数 `self` 前加上 `&`, 表示该方法借用了 `Self` 的实例, 这部分的行为与 `rectangle: &Rectangle` 所表示的行为是一致的. 方法可以获取 `self` 的所有权, 以不可变的方式借用 `self`(我们目前的代码就是这样做的), 也可以以可变的方式借用 `self`, 和其他参数无异.

在这里我们选择使用 `&self`, 和在函数的版本中选择 `&Rectangle` 是基于同样的理由: 我们并不想要获取所有权, 只是单纯地想读取结构体中的数据而已, 并没有想要写入数据. 如果想要修改方法所对应的结构体实例, 就要使用 `&mut self` 作为第一个参数. 一般情况下, 如果某个结构体的方法只接受 `self` 作为参数, 该方法的内部大概率不会想要获取结构体实例的所有权. 有种可能的使用场景是, 方法内部要将 `self` 转换成其它实例时, 我们希望避免在转换之后使用其它实例时, 误用了原始的实例.

使用方法而不是函数的主要原因, 除了提供方法语法和不需要在方法签名内部不断重复 `self` 的类型之外, 还有就是为了能够使代码组织性变得更强. 我们在 `impl` 块中列出了所有针对该类型的实例能够实现的功能, 这样一来, 别的开发者查看我们的代码时就不需要费力到各处去搜索 `Rectangle` 究竟有什么能力了.

对了, 对于方法名, 我们可以选择与字段名相同. 比如, 在 `Rectangle` 中, 存在 `width` 字段, 我们同样可以定义一个名为 `width` 的方法:

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn width(&self) -> bool {
        self.width > 0
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    if rect1.width() {
        println!("The rectangle has a nonzero width; it is {}", rect1.width);
    }
}
```

在上面的例子中, 我们的 `width` 方法实现了这样的功能: 如果实例的 `width` 字段值大于 0 的话, `width` 方法就返回 `true`, 如果值是 0 则返回 `false`: 在任何情况下我们都能在方法内使用与之同名的字段. 在 `main` 函数中, 当 Rust 发现我们在 `rect1.width` 之后加上括号, 就知道此时的 `width` 指的是方法. 如果后面没有跟上括号则是字段 `width`.

当我们在结构体中定义与字段同名的方法, 通常(但并不是所有时候)会是希望该方法只返回字段中的值, 而不做任何其他事情. 这样的方法被称为 _getters_, Rust 不像一些其他语言一样内置 getters, 我们必须手动实现. Getters 很有用, 我们可以将某个字段设置为私有, 同名方法为公开方法, 通过这样的方式设置字段的只读属性, 提供一个公开的 API 来读取该字段. 我们会在第七章对私有和公有的概念, 以及如何指定字段或方法为公有或者私有进行详细的介绍.

::: tip Where’s the -> Operator?

:::