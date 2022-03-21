- [5.1 定义并实例化结构体](#51-定义并实例化结构体)
  - [使用字段初始化简写语法](#使用字段初始化简写语法)
  - [使用结构体更新语法基于其他实例创建新的实例](#使用结构体更新语法基于其他实例创建新的实例)
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

