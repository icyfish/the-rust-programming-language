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

::: tip -> 运算符在哪里?
在 C 和 C++ 程序语言中, 调用方法有两种方式: 如果是直接调用对象上的方法, 可以直接用 `.` 运算符, 调用关联到对象的指针上的方法, 则是用 `->`, 并且此时还需要先对指针进行解引用(dereference). 换句话说, 如果 `object` 是一个指针, 那么 `object->something` 就类似 `(*object).something`.

Rust 中并没有与 `->` 运算符同样功能的运算符, 不过, Rust 中有个特性: **自动引用和解引用**(_automatic referencing and dereferencing_). 当我们调用结构体中的方法的时候, 就会发生自动引用和解引用的行为.

它内部是这样工作的: 当我们这样调用方法时: `object.something()`, Rust 会为 `object` 自动添加 `&`, `&mut`, 或者 `*`, 使得 `object` 能够匹配方法的签名. 也就是说, 以下两部分代码是一致的:

```shell
#![allow(unused)]
fn main() {
#[derive(Debug,Copy,Clone)]
struct Point {
    x: f64,
    y: f64,
}

impl Point {
   fn distance(&self, other: &Point) -> f64 {
       let x_squared = f64::powi(other.x - self.x, 2);
       let y_squared = f64::powi(other.y - self.y, 2);

       f64::sqrt(x_squared + y_squared)
   }
}
let p1 = Point { x: 0.0, y: 0.0 };
let p2 = Point { x: 5.0, y: 6.5 };
p1.distance(&p2);
(&p1).distance(&p2);
}
```

第一行的代码 `p1.distance(&p2);` 看起来更简洁一些. 自动引用的行为之所以有效的原因是方法有一个明确的接收者 -- `self` 的类型. 只要知道了接收者和方法的名称, Rust 就能够区分出方法是在进行读取(`&self`), 修改(`&mut self`)还是获取所有权(`self`)的操作. Rust 对方法接收者的隐式借用使得所有权的功能在实践中更加好用.
:::

### 当方法接受多个参数

现在我们开始实现 `Rectangle` 结构体的第二个方法. 这一次, 我们要实现这样的操作: 让 `Rectangle` 的一个实例接收它的另一个实例, 如果如果第二个长方形能够完全被套入第一个长方形中的话, 就返回 `true`, 否则返回 `false`. 也就是说, 一旦我们定义了 `can_hold` 方法, 就能够编写以下示例 5-14 中的代码:

```rust
fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    let rect2 = Rectangle {
        width: 10,
        height: 40,
    };
    let rect3 = Rectangle {
        width: 60,
        height: 45,
    };

    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));
}
```

预期的输出结果大概会是下面这样, 因为 `rect2` 的宽高都比 `rect1` 小, 而 `rect3` 的宽度大于 `rect1` 的宽度:

```shell
Can rect1 hold rect2? true
Can rect1 hold rect3? false
```

因为我们想要定义一个方法, 所以应该在 `impl Rectangle` 块中定义. 方法名为 `can_hold`, 并且该方法接收另一个 `Rectangle` 的不可变借用作为参数. 通过查看调用该方法的代码, 我们可以区分出参数的类型: `rect1.can_hold(&rect2)` 传入的参数是 `&rect2`, 它是 `Rectangle` 其中一个实例 `rect2` 的不可变借用. 此时使用不可变借用比较合理, 因为我们只需要读取 `rect2`(并不需要写入, 如果是写入的话, 就应该使用可变借用), 同时我们希望 `main` 函数持续拥有 `rect2` 的所有权, 以便在调用 `can_hold` 方法之后依然能够使用它. `can_hold` 方法的返回值类型是布尔值, 其内部实现的功能是: 检查 `self` 的宽高值是否大于 `Rectangle` 另一个实例的对应宽度和高度值. 现在我们在代码5-13中的 `impl` 块中添加 `can_hold` 方法的实现, 具体代码示例为下面的 5-15:

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

    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    let rect2 = Rectangle {
        width: 10,
        height: 40,
    };
    let rect3 = Rectangle {
        width: 60,
        height: 45,
    };

    println!("Can rect1 hold rect2? {}", rect1.can_hold(&rect2));
    println!("Can rect1 hold rect3? {}", rect1.can_hold(&rect3));
}
```

实现了 `can_hold` 方法之后, 当我们执行5-14中的代码, 就能够得到预期的结果. 方法能够接受多个参数, 这些参数都紧接在 `self` 参数之后, 这些参数与普通的函数参数的功能并没有区别.


### 关联函数