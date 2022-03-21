### 5.1 定义和实例化结构体

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

