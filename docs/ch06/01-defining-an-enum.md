[[toc]]

[Original](https://doc.rust-lang.org/stable/book/ch06-01-defining-an-enum.html)
## 6.1 定义枚举

之前我们学习过使用结构体来自定义数据类型, 枚举则是另外一种自定义的方式. 我们先从一个实际场景开始, 用代码对场景进行呈现, 从而了解枚举类型存在的必要性, 以及为什么在这种场景下使用枚举类型比使用结构体更加合适. 假设现在我们需要处理 IP 地址. 目前 IP 地址的定义有两套标准: 版本4(IPv4)和版本6(IPv6). 所以在我们的程序中处理 IP 地址时也只有这两种情况, 我们可以枚举出所有可能的变体, **枚举**也因此得名.

任何 IP 地址, 要么属于 IPv4, 要么属于 IPv6, 但不能同时属于两者. 由于 IP 地址的这个特性, 枚举类型在此是十分合适的使用场景, 因为一个枚举值只能属于其中一个变体. 不管是IPv4还是 IPv6 的地址, 本质上都属于 IP 地址, 因此在代码中遇到处理 IP 地址的场景时, 都应该把它们看做同一种类型. 

现在我们开始用代码来阐述上述的概念, 定义一个枚举 `IpAddrKind`, 并在其中列举所有可能的 IP 地址种类: `V4` 和 `V6`. 这些就是枚举的成员:

```rust
enum IpAddrKind {
    V4,
    V6,
}

fn main() {
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;

    route(IpAddrKind::V4);
    route(IpAddrKind::V6);
}

fn route(ip_kind: IpAddrKind) {}
```

`IpAddrKind` 现在是一个自定义的数据类型了, 我们可以在代码中使用它.

### 枚举值

现在我们可以基于 `IpAddrKind` 的两个变体创建他们的示例了:

```rust
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

Note that the variants of the enum are namespaced under its identifier. 我们使用双冒号将枚举值类型和变体分离. 此时两个值 `IpAddrKind::V4` 和 `IpAddrKind::V6` 都属于同一个类型: `IpAddrKind`. 接下来我们可以定义一个函数, 接受类型为 `IpAddrKind` 的参数:

```rust 
fn route(ip_kind: IpAddrKind) {}
```

可以用任意一个变体来调用这个函数:

```rust
route(IpAddrKind::V4);
route(IpAddrKind::V6);
```

使用枚举类型还有其他的好处. 举个例子, 我们的 IP 地址类型, 目前我们没有合适的方法来存储实际的 IP 地址数据; 只知道地址的 **类型** (_kind_). 因为刚学习过第五章结构体的内容, 你或许会选择使用结构体类型来解决这个问题, 如代码6-1所示:

```rust
// 使用结构体类型来存储 IP 地址数据和 IpAddrKind 类型的变体
enum IpAddrKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

let home = IpAddr {
    kind: IpAddrKind::V4,
    address: String::from("127.0.0.1"),
};

let loopback = IpAddr {
    kind: IpAddrKind::V6,
    address: String::from("::1"),
};
```

在这里我们定义了结构体 `IpAddr`, 它存在两个字段: 其中一个是 `kind`, 类型为 `IpAddrKind`(之前定义过的枚举类型), 另一个字段是 `address`, 类型为 `String`. 然后我们基于这个结构体创建了两个示例. 第一个是 `home`, 其中字段 `kind` 的值为 `IpAddrKind::V4`, 相关联的地址数据为 `127.0.0.1`. 第二个实例则是 `loopback`, 它的 `kind` 值为 `IpAddrKind` 的另一个变体 `V6`, 相关联的地址数据则是 `::1`. 这样一来, 我们就用结构体绑定了 `kind` 和 `address` 的值, 因此变体和值现在就互相关联起来了.

不过我们可以有更简洁的方式, 那就是只使用一个枚举类型: 不要将枚举类型放在结构体中, 而是将数据直接置于每一个枚举类型的变体中. 于是我们开始定义新的枚举类型 `IpAddr`, 变体 `V4` 和 `V6` 都有相关联的 `String` 值:

```rust 
enum IpAddr {
    V4(String),
    V6(String),
}

let home = IpAddr::V4(String::from("127.0.0.1"));

let loopback = IpAddr::V6(String::from("::1"));
```

现在我们将数据和枚举值的变体直接关联, 这样就不需要额外的结构体类型. 现在我们能够更容易地探索枚举值的工作原理细节: 我们为枚举值变体所定义的名字同样也是创建枚举值实例的函数. 也就是说: `IpAddr::V4()` 实际上是一个函数调用, 接受一个 `String` 类型的参数, 返回 `IpAddr` 类型的梳理. 因此, 当我们定义了一个枚举值之后, 同时也定义了一个构造器函数.

使用枚举类型比起使用结构体还有另一个好处: 每一个变体都可以是不同的类型, 关联许多不同的数据. V4 类型的 IP 地址通常由4种不同的数字单元构成, 数字的值范围为 0-255. 如果我们希望改变 `V4` 类型的地址数据为4种`u8`类型数字, `V6` 类型则依然保持不变, 就无法用结构体类型来表示了. 但是使用枚举类型就能够很容易完成:

```rust 
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

let home = IpAddr::V4(127, 0, 0, 1);

let loopback = IpAddr::V6(String::from("::1"));
```

截至目前, 我们展示了好多种不同的定义数据结构的方式来存储 V4 和 V6 类型的地址. 不过因为 IP 地址的使用比较频繁, [rust 标准库中也定义了这个类型](https://doc.rust-lang.org/stable/std/net/enum.IpAddr.html). 现在我们开始看看标准库是如何定义 `IpAddr` 的: 它的枚举类型和变体与我们之前所定义和使用的完全一致, 唯一的区别是变体中的地址数据是两种不同的结构体形式:

```rust
struct Ipv4Addr {
    // --snip--
}

struct Ipv6Addr {
    // --snip--
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
```

从以上代码中可以看出来, 我们能够在枚举类型变体中存储任意类型的数据: 字符串, 数字类型或者是结构体, 甚至可以是另一种枚举类型! 同时, 标准库类型通常情况下并不会比我们自己所定义的更复杂.

有一点要注意的是, 尽管标准库定义了 `IpAddr`, 我们依然可以定义自己的 `IpAddr` 类型, 只要在当前作用域下没有引入标准库中的相关类型. 在第七章中我们会详细介绍在作用域中引入类型的内容.

现在我们来查看另一个枚举类型的代码示例(6-2): 这个枚举类型的变体中包含了更多的类型.

```rust 
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```
 
以上的枚举类型的四种变体是四种不同的类型:

- `Quit` 没有关联任何数据.
- `Move` 关联了两个具名字段, 类似结构体类型.
- `Write` 接受 `String` 类型.
- `ChangeColor` 接受 3 个 `i32` 类型的值.

配合变体来定义枚举值类型, 和定义不同类型的结构体很类似, 唯一的区别是枚举类型不使用 `struct` 关键词, 同时所有变体都集体属于 `Message` 类型. 以下的结构体类型所接受的数据和我们之前定义的枚举类型是一致的:

```rust
struct QuitMessage; // unit struct
struct MoveMessage {
    x: i32,
    y: i32,
}
struct WriteMessage(String); // tuple struct
struct ChangeColorMessage(i32, i32, i32); // tuple struct
```

但如果我们使用不同的结构体类型, 存在各自的类型, 就很难定义一个函数能接受所有类型的数据, 而使用枚举类型 `Message` 就很容易实现, 因为这是个单一类型.

枚举类型和结构体还有一个相同点: 之前提到过我们能够使用 `impl` 在结构体中定义方法, 同样能够在枚举类型上定义方法. 以下代码示例中我们在 `Message` 枚举中定义了一个名为 `call` 的方法:

```rust
impl Message {
    fn call(&self) {
        // method body would be defined here
    }
}

let m = Message::Write(String::from("hello"));
m.call();
```

在 `call` 方法的函数体中, 我们可以使用 `self` 来读取调用方法的值. 在示例中, 我们创建了一个变量 `m`, 其值为: `Message::Write(String::from("hello"))`, 当我们执行 `m.call()` 调用 `call` 方法时, 其中的 `self` 所指代的就是这个值.

现在我们开始学习另一个在标准库中十分常见的枚举类型: `Option`.

### `Option` 枚举和它相比 Null 值的优势

这一部分是对 `Option` 类型的介绍, 它也在标准库中被定义. `Option` 类型实际上十分常用, 表示某个值存在与否. 举个例子, 如果你计划获取一个非空列表中的第一个值, 肯定会读取到值. 但如果计划获取一个空列表中的第一个值, 就不会读取到任何内容. 在类型系统中引入这个概念之后, 编译器就能够帮助开发者检查是否处理了所有需要处理的情况, 避免一些在其它编程语言中会经常出现的 bug.

Programming language design is often thought of in terms of which features you include, but the features you exclude are important too. Rust 中不存在 null 这类的特性, 而许多其他编程语言中普遍存在. `Null` 表示空值. 在存在 null 特性的编程语言中, 变量始终属于这两种状态之一: null 或者 非 null.

Tony Hoare, null 的发明者, 在他 2009 年的一次演讲: "Null References: The Billion Dollar Mistake" 中, 表达了这样的想法:

>我认为 null 的存在是一个巨大的错误. 当时, 我正在为面向对象编程语言的引用特性设计一个完备的类型系统. 目标是依赖编译器的检查就能够确保所有引用在使用时的绝对安全. 但我没有抵御住 null 的诱惑, 将这个特性引入了, 因为 null 实在是太容易实现了. 可是这个特性同时也带来了数不清的异常, 使程序变得极其脆弱, 引发了许多系统异常. 在过去 40 年间造成了许多损失.

The problem with null values is that if you try to use a null value as a not-null value, you’ll get an error of some kind. 因为 null/非null属性应用很广泛, 因此这类错误特别容易产生.

然而, null 所表示的含义依然很实用: 其含义是某个值出于某种原因, 在当下是不合法的.

其实问题不在于 null 的概念本身, 而在于某些特定的实现. 由于这个原因, Rust 语言中没有 null 的概念, 不过枚举值类型可以用以模拟这个概念. 该枚举值类型为 `Option<T>`, 这个枚举值类型同样在[标准库](https://doc.rust-lang.org/stable/std/option/enum.Option.html)中有定义: 

```rust
enum Option<T> {
    None,
    Some(T),
}
```

`Option<T>` 枚举类型十分常用, 因此在预置库中也加入了这个类型, 开发者不需要再额外将其引入作用域. 与之同时存在于预置库中的还有它的变体: 我们可以直接使用 `Some` 和 `None` 来表示, 省略 `Option::` 前缀. `Option<T>` 枚举类型依然是正常形式的枚举类型, `Some<T>` 和 `None` 则依然是 `Option<T>` 类型的变体.

`<T>` 也是 Rust 中的一个语法, 我们之前还没有提到过. 这是个泛型参数, 我们会在第十章中详细介绍这个概念. 现在我们只需要知道 `<T>` 表示 `Option` 枚举类型的变体 `Some` 可以接受任意类型的数据, 并且当 T 的类型不同时, `Option<T>` 的类型也会随之变化成为一个完全不同的类型. 现在我们来看一些使用 `Option` 具体例子:

```rust 
let some_number = Some(5);
let some_string = Some("a string");

let absent_number: Option<i32> = None;
```

`some_number` 的类型是 `Option<i32>`, `some_string` 的类型是 `Option<&str>`, 是一个完全不同的类型. 我们在 `Some` 变体中表明了所接受参数的值, 因此 Rust 能够推测出这些结果的类型. 对于 `absent_number`, Rust 要求我们显式声明 `Option` 的类型: 编译器只通过 `None` 值无法推测出相关联的 `Some` 变体所对应的值的类型. 因此我们要在此显式声明 `absent_number` 的类型, 此时为 `Option<i32>`.

When we have a Some value, we know that a value is present and the value is held within the Some. 当某个值是一个 `None` 值时, 则表明该值和 null 是一样的含义: 这个值不合法. 那么为什么 `Option<T>` 比起 null 是更好的表达方式呢?

简而言之, 是因为 `Option<T>` 和 `T` (`T` 可以是任意类型的数据)属于不同的类型, 如果某个值确定是个合法的值, 编译器不会允许我们使用 `Option<T>`. 举个例子, 以下代码就不会被编译, 因为它在尝试将两个不同类型的值(`i8` 和 `Option<i8>`)相加:

```rust
let x: i8 = 5;
let y: Option<i8> = Some(5);

let sum = x + y;
```

如果我们执行以上代码, 会碰到以下错误:

```
$ cargo run
   Compiling enums v0.1.0 (file:///projects/enums)
error[E0277]: cannot add `Option<i8>` to `i8`
 --> src/main.rs:5:17
  |
5 |     let sum = x + y;
  |                 ^ no implementation for `i8 + Option<i8>`
  |
  = help: the trait `Add<Option<i8>>` is not implemented for `i8`

For more information about this error, try `rustc --explain E0277`.
error: could not compile `enums` due to previous error
```

这个错误信息表明 Rust 不知道如何对一个 `i8` 类型和 `Option<i8>` 类型的值执行相加的操作, 因为它们是不同的类型. 当我们的在 Rust 中有个值的类型为 `i8` 时, 编译器能够确保这个值始终是合法的. 我们可以很放心地使用这个值, 不必担心它可能会是空值. 只有当值类型是 `Option<xxx>`的时候, 我们才需要担心存在空值的情况, 同时编译器也会处理这类的情况, 确保我们使用的安全.

换句话说, 如果你想对 `T` 执行某些操作, 必须将 `Option<T>` 转换成 `T`. 大部分情况下, 这个特性能够帮助我们避免 `null` 所带来的常见问题: 当某个值实际上就是 null 却被当做值存在的情况.

排除误判非 null 值的风险能够帮助我们写出更好的代码. 如果代码中存在某个值可能为 null, 那么我们就要将其声明为 `Option<T>` 类型. 这样当我们想要使用这个值的时候, 就必须要处理值为 null 时的情况. 只要某个值的类型不是 `Option<T>`, 我们就能够确保这个值不是 null. 这是 Rust 中有意为之的设计, 目的是避免 null 的滥用并且提高 Rust 代码的安全性.

那么, 当我们遇到一个值的类型是 `Option<T>` 的时候, 我们如何从 `Some` 变体中读取到 `T` 的值以便使用呢? `Option<T>` 枚举类型存在许多方法属性, 在很多场景下都十分有用, 具体可以查看[文档](https://doc.rust-lang.org/stable/std/option/enum.Option.html). 熟悉 `Option<T>` 的方法属性对 Rust 编程有很大的帮助.

总的来说, 为了使用 `Option<T>` 的值, 我们要让代码处理每一个变体的情况. 当某个值为 `Some<T>` 时, 你希望某些代码能够执行, 这些代码可以使用内部的 `T`. 而当某个值为 `None` 时, 你希望另一些代码能够执行, 这些代码不可以使用 `T` 值, 因为根本不存在. `match` 表达式是一个控制流的结构, 正好用于处理以上的枚举类情况, 对于不同的变体执行不同的代码. 