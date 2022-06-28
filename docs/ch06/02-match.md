[Original](https://doc.rust-lang.org/stable/book/ch06-02-match.html)

[[toc]]

## 6.2 `match` 控制流结构体

Rust 中有存在一个很强大的控制流结构体: `match`, 允许我们在一系列的模式下对某个值进行对比, 然后选择匹配的模式执行对应的代码. 模式由字面值, 变量名, 通配符等组成; 第 18 章介绍了所有不同类型的模式及其功能. `match` 的强大在于各个模式的表达能力, 以及编译器能够确保所有可能的情况都被处理.

我们可以把 `match` 表达式看作是硬币分类机器: 硬币通过不同大小的管道被分配到它应该去的位置. 同样地, 值也会经由 `match` 中的各个模式, 发现匹配的模式之后, 就会执行对应的代码. 既然说到了硬币的例子, 那么我们就用硬币来作为说明 `match` 的示例! 现在我们实现一个函数, 接受任意一个美元硬币, 函数的功能和硬币分类机器差不多, 我们对硬币的类型进行判断然后返回以硬币转换为美分为单位的数值:

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

现在我们将 `value_in_cents` 函数中的 `match` 进行拆解, 首先我们列出 `match` 关键词, 其后是一个表达式, 在本例中是 `coin`. 这种用法和使用 `if` 的表达式很类似, 但有一点不同: `if` 表达式返回的是一个布尔值, `match` 则可以返回任何类型的值. 本例中, `coin` 的类型是我们在第一行中所定义的 `Coin` 枚举类型.

接下来是 `match` 的分支. 一个分支存在两个部分: 分别是模式和相关的代码. 第一个分支的模式是 `Coin::Penny` 和 `=>` 运算符, 这个运算符分离了模式和需要执行的代码. 在本例中, 需要执行的代码是值 `1`. 每个分支之间用逗号分隔.

当 `match` 表达式执行时, 会按顺序对比结果值和每个分支的模式. 如果值与模式匹配的话, 相关的代码就会执行, 不匹配则进入下一个分支, 与先前提到的硬币分类机器很相似. 对于分支的数量, 并没有限制, 可以存在任意数量的分支: 在以上的示例代码中, `match` 存在四个分支.

与每个分支关联的代码都是一个表达式, 整个 `match` 表达式最终返回的值是所匹配分支中表达式的结果值. 

如果 `match` 中的分支代码比较短的话, 我们就不会使用大括号包裹表达式, 就像上述示例代码那样. 但如果分支中的表达式代码比较长包含多行, 就必须要使用大括号. 举个例子, 以下 `Coin::Penny` 模式所对应的输出 "Lucky penny!" 的代码, 同时还输出了代码片段 `1`:

```rust
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

### 与值绑定的模式

match 分支另一个有用的特性是它们能够绑定模式所对应的值. 我们可以利用这个特性来从枚举变体中提取值.

举个例子, 我们将枚举变体修改为在内部接受数据. 在 1999-2008 年期间, 美国在25美分硬币为50个州的一侧的每一个都印上了不同的设计. 其他面值的硬币都没有这样的设计, 因此只有这类25美分的硬币有额外的价值. 现在我们将这部分信息添加到我们的枚举类型中, 修改 `Quarter` 变体以包含 `UsState` 值:

```rust
#[derive(Debug)] // so we can inspect the state in a minute
enum UsState {
    Alabama,
    Alaska,
    // --snip--
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}
```

现在假设一个朋友想要收集所有50个州的美分硬币. 当我们根据硬币类型分类零钱的同时, 也对美分硬币进行归类, 如果朋友缺少对应的硬币, 可以直接对其进行收藏.

在这段代码的 match 表达式中, 我们在模式 `Coin::Quarter` 中添加了一个名为 `state` 的变量, 当匹配到这个模式的时候, `state` 变量会绑定到对应的值中. 用代码呈现就是如下这样:

```rust
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}
```

如果我们调用 `value_in_cents(Coin::Quarter(UsState::Alaska))`, `coin` 将会是 `Coin::Quarter(UsState::Alaska)`. 我们将值与每一个分支进行对比时, 直到碰到 `Coin::Quarter(state)`. 此时, `state` 绑定的值将会是 `UsState::Alaska`, 接下来我们在 `println!` 表达式中将所绑定的值输出, 也就是 `Coin` 枚举的变体 `Quarter` 内部 state 的值.

### 匹配 `Option<T>`

