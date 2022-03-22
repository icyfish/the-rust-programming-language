- [5.1 定义并实例化结构体](#51-定义并实例化结构体)
  - [使用字段初始化简写语法](#使用字段初始化简写语法)
  - [使用结构体更新语法基于其他实例创建新的实例](#使用结构体更新语法基于其他实例创建新的实例)
  - [使用无命名字段的元组结构体来创建不同的类型](#使用无命名字段的元组结构体来创建不同的类型)
  - [没有任何字段的类单元结构体](#没有任何字段的类单元结构体)
### 5.1 定义并实例化结构体

结构体和元组类似, 在[类型: 元组](https://doc.rust-lang.org/book/ch03-02-data-types.html#the-tuple-type)这一章节对元组有详细的介绍, 两者的相同点在于都能够存储多种类型的关联值. 和元组一样, 结构体中的每一个元素都可以是不同的类型. 两者的不同之处在于, 在结构体中我们要对每一个元素进行命名, 以便清楚了解每一个元素的含义. 这个不同点也使得结构体比元组更加灵活: 我们不需要严格依赖顺序声明或者读取实例中的值.

那么如何定义结构体呢, 我们可以使用关键词 `struct`, 然后紧接着的是结构体的名称. 命名需要遵循的规则是描述所组合的数据的含义. 然后在大括号中, 定义每一项元素的名称和类型, 我们称之为 **字段** (_fields_). 例如, 实例 5-1 就是一个存储用户账号信息的结构体:

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {}
```

既然已经定义了一个结构体, 那么我们就要开始使用它. 我们通过声明每一个字段的具体值来创建结构体的 **实例**. 首先声明结构体的名称, 然后跟上一对大括号, 在大括号中以 `key: value` 键值对的形式呈现每一个具体的字段, 其中 `key` 是字段名, `value` 是我们想要存储在这个字段中的值. 实例中的字段的顺序不需要与结构体中字段顺序一致. 也就是说, 结构体的定义相当于一个类型的模板, 实例则基于这个模板填充特定的数据. 比如, 我们可以像示例 5-2 这样来定义一个特定的用户.

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
}
```

如果想要从结构体中获取某个特定类型的值, 可以使用点操作符. 比如我们想要读取用户的邮箱地址, 可以使用 `user1.email`. 如果这个实例是可变值, 我们还可以使用点操作符来改变实例中的某个字段值. 代码示例 5-3 就展示了如何改变 `User` 实例中 `email` 值的方法:

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    let mut user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };

    user1.email = String::from("anotheremail@example.com");
}
```

注意, 以上的行为只有当整个实例是可变的时候才成立; Rust 不会允许我们只将某个字段标为可变. 和其他的表达式一样, 我们可以在函数中创建一个新的实例作为最后一个表达式, 来隐式地返回这个实例.

代码示例 5-4 中的函数 `build_user`, 就返回了一个 `User` 实例, 其中 `email` 和 `username` 字段是函数接收的参数. `active` 字段的值是 `true`, `sign_in_count` 的字段值是 `1`.

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        email: email,
        username: username,
        active: true,
        sign_in_count: 1,
    }
}

fn main() {
    let user1 = build_user(
        String::from("someone@example.com"),
        String::from("someusername123"),
    );
}
```

保持函数参数的命名与结构体中的字段一致是可以理解的, 但是必须重复 `email` 和 `username` 的字段名称和值不免有些繁琐. 如果结构体存在更多字段的话, 重复每一个名字就更麻烦了. 不过幸运的是, 我们有一个更方便的语法.

#### 使用字段初始化简写语法

在代码示例 5-4 中, 参数名称和结构体中的字段名称完全一致, 因此我们可以使用 **字段初始化简写语法**(_field init shorthand_)来重写 `build_user`, 以不重复 `email` 和 `username` 的方式达到同样的目的, 正如在代码示例5-5中列出的一样:

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn build_user(email: String, username: String) -> User {
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}

fn main() {
    let user1 = build_user(
        String::from("someone@example.com"),
        String::from("someusername123"),
    );
}
```

在以上代码示例中, 我们创建了一个基于结构体 `User` 的实例, 结构体中其中一个字段是 `email`. 在 `build_user` 函数中, 我们想要将传入函数中的参数 `email` 的值设置为字段 `email` 的值. 因为两者名称一致, 所以只需要 `email` 即可, 不需要重复声明 `email: email`.


#### 使用结构体更新语法基于其他实例创建新的实例

有一个很常见的场景是, 基于某个实例创建新的实例, 但只修改其中一部分字段. 此时我们可以使用 **结构体更新语法** (_struct update syntax_)达到我们的目的.

看代码示例5-6, 不使用结构体更新语法, 我们想要基于 `user1` 创建 `user2`, 要这样实现. 我们为 `user2` 的字段 `email` 字段设置一个全新的值, 而其他字段则保持与代码示例5-2`user1` 中的一致.

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    // --snip--

    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };

    let user2 = User {
        active: user1.active,
        username: user1.username,
        email: String::from("another@example.com"),
        sign_in_count: user1.sign_in_count,
    };
}
```

使用了结构体更新语法之后, 我们可以使用更少的代码达到同样的效果, 具体示例见5-7. `..`语法表示的意思是: 没有显式设置的字段值应该与`..`之后代表的实例中的剩余字段值一致. 代码示例5-7:

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

fn main() {
    // --snip--

    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };

    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
}
```

代码示例5-7中, 创建了一个与5-6中同样的 `user2`, 除了字段 `email` 值与 `user1` 不一致之外, 其他字段 `username`, `active`, `sign_in_count` 都是一样的. `..user1` 必须置于最后来表明剩余的值需要从 `user1` 的对应字段中获取, 同样地在这里我们也不需要理会字段在结构体中所定义的顺序.

注意, 结构更新使用了与赋值一样的 `=` 符号, 这是因为它也转移了数据, 关于转移(move)数据, 在这一章: [变量与数据交互的方式: 移动](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#ways-variables-and-data-interact-move)中有详细介绍. 在以上示例中, `user2` 创建完成之后, 我们就不再能使用 `user1` 了, 因为 `user1` 中的 `username` 字段中的 `String` 值被移到了 `user2` 中. 如果我们给 `user2` 中的 `email` 和 `username` 字段附上新的 `String` 值, 只使用 `user1` 中的 `active` 和 `sign_in_count`, 那么在 `user2` 创建之后, `user1` 还会保持合法. 因为 `active` 和 `sign_in_count` 是实现了 `Copy` trait 的类型, 因此我们在[只存储在栈上的数据: 拷贝](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html#stack-only-data-copy)一章中讨论到的行为对这两个字段适用.


#### 使用无命名字段的元组结构体来创建不同的类型

Rust 还支持类似元组的结构体, 称为 **元组结构体** (_tuple structs_). 元组结构体有结构体名称提供的含义, 但是没有具体的字段名, 只有字段的类型. 当你想要给某个元组一个特定的名字且与其他元组区分开, 或者觉得给每一个结构体的字段命名很麻烦的话, 就可以使用元组结构体. 

现在我们开始定义一个元组结构体, 首先使用关键词 `struct`, 其后跟着一个声明了所有元素类型的元组. 下面举出了两个元组结构体的例子: `Color` 和 `Point`:

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

注意 `black` 和 `origin` 属于不同的类型, 因为它们是不同元组结构体的不同实例. 我们所定义的每一个结构体都有各自的类型, 即使其中的每一个字段都是同样的类型, 结构体本身也有差别. 比如说, 一个函数, 已经声明了参数类型为 `Color`, 就不允许接受类型为 `Point` 的参数, 即使这两个结构体中的每个字段类型都是一致的(以上例子中都为 `i32`). 除此之外, 元组结构体的实例行为和元组类似: 可以将它们解构为单独的部分, 也可以使用 `.` 操作符加索引以读取其中的元素.

#### 没有任何字段的类单元结构体

我们还可以定义一个没有任何字段的结构体! 它们叫做 **类单元结构体**(_unit like structs_), 这样命名是因为它们的行为和 `()` 类似, 在[元组类型](https://doc.rust-lang.org/book/ch03-02-data-types.html#the-tuple-type)部分我们提到过 `unit` 类型. 当我们需要在特定类型中实现某个 `trait` 但不需要在其中存储任何数据的时候, 就可以使用类单元结构体. 在第十章中我们会详细介绍 trait. 下面是一个声明并初始化一个类单元结构体 `AlwaysEqual` 的示例:

```rust
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
}
```

为了定义 `AlwaysEqual`, 我们使用 `struct` 关键词, 紧接着是我们想要的名称, 其后是一个分号. 此时不需要大括号或者小括号. 然后我们在主函数中