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

在先前的章节中, 使用 `Option<T>` 的时候, 我们是想要从 `Some` 中获取 `T` 的值; 同时我们还可以使用 `match` 来处理 `Option<T>`, 就像我们处理枚举值 `Coin` 一样. 唯一不一样的是, 对比的不是硬币而是 `Option<T>` 的变体, `match` 表达式的工作方式始终是一致的.

现在假如我们想要编写一个函数, 接受一个参数是 `Option<i32>`, 如果内部含有值, 则将其加一.  如果内部没有值, 该函数就会返回 `None` 值, 并且不执行任何操作.

因为有了 `match`, 这个函数很容易实现:

```rust 
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```

现在仔细观察 `plus_one` 的执行细节. 当我们调用 `plus_one(five)` 的时候,  `plus_one` 函数体中的变量 `x` 值为 `Some(5)`. 然后开始在 `match` 中的每一个分支进行对比.

```rust 
None => None,
```

`Some(5)` 的值不匹配模式 `None`, 因此我们进入下一个分支.

```rust 
Some(i) => Some(i + 1),
```

那么 `Some(5)` 和 `Some(i)` 是匹配的吗? 答案是肯定的, 现在我们有了相同的变体. `i` 绑定到了 `Some` 的一个变体中, 因此 `i` 的值是 `5`. `match` 中的对应分支代码会执行, 所以我们给 `i` 的值加 1 并返回一个其中包含 `6` 的 `Some` 值.

现在开始查看以上代码示例中的第二个函数调用: `plus_one(None)`, 此时参数 `x` 的值为 `None`. 在 `match` 中进行第一个分支代码的执行.

```rust 
None => None,
```

直接匹配了, 没有需要添加的其他值, 于是函数执行结束并返回 `None` 值. 因为匹配上了第一个分支, 其他分支的代码就无需再执行.

在许多场景下, `match` 和枚举值是很实用的组合. 因此我们可以在 Rust 中看到很多类似的代码: `match` 一个枚举, 并绑定变量到内部的数据中, 基于此执行相关的代码. 刚开始接触这样的模式可能会觉得有点复杂, 不过一旦你习惯这样的模式之后, 就会希望在其他编程语言中也能够有这样的特性. 这始终是 Rust 用户最爱的特性.


### 匹配是可穷举的

关于 `match`, 我们还有一点需要讨论. 以下版本的 `plus_one` 函数有个 bug, 因此不能被编译:

```rust 
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        Some(i) => Some(i + 1),
    }
}
```

我们没有处理 `None` 的情况, 因此代码会引起 bug. 幸运的是, 这个 bug 能够被 Rust 编译器捕获. 当我们尝试编译以上代码的时候, 就会发现以下错误:

```
$ cargo run
   Compiling enums v0.1.0 (file:///projects/enums)
error[E0004]: non-exhaustive patterns: `None` not covered
   --> src/main.rs:3:15
    |
3   |         match x {
    |               ^ pattern `None` not covered
    |
    = help: ensure that all possible cases are being handled, possibly by adding wildcards or more match arms
    = note: the matched value is of type `Option<i32>`

For more information about this error, try `rustc --explain E0004`.
error: could not compile `enums` due to previous error
```

RUst 知道我们的代码没有处理所有的可能情况, 甚至能够知道我们究竟忘记了哪些模式! 匹配的模式在 Rust 中是**可穷举**(_exhaustive_)的: 为了使代码合法, 我们必须穷举出所有可能的分支. 特别是在 `Option<T>` 存在的情况下, 当 Rust 发现我们的代码中缺少了处理 `None` 情况的分支并抛出错误时, 实际上是在帮助我们避免遗漏处理 `null` 的情况, 我们上面讨论的超过十亿美元的错误就是这类遗漏引起的.

### 通配模式以及 `_` 占位符

使用枚举类型, 我们还可以对某些特定值进行一些特殊的处理, 对于其他的值则会执行默认的操作. 假设我们现在要实现一个游戏, 如果你掷骰子掷到了3, 你的对手就无法移动, 而你会得到一顶精致的帽子. 如果你掷到了7, 你就会失去一顶精致的帽子. 而对于所有其他值, 都是在棋盘格中走相应数量的步数. 现在 `match` 实现了上述的逻辑, 但骰子的结果是硬编码而非随机值, 其他部分的代码使用没有函数体的函数来表示, 因为实现它们超出了本例的范围:

```rust 
let dice_roll = 9;
match dice_roll {
    3 => add_fancy_hat(),
    7 => remove_fancy_hat(),
    other => move_player(other),
}

fn add_fancy_hat() {}
fn remove_fancy_hat() {}
fn move_player(num_spaces: u8) {}
```

对于前两个分支, 匹配模式是字面值 3 和 7, 而最后一个分支则覆盖了所有可能情况, 匹配模式是被我们命名为 `other` 的一个变量, 这也是我们传入 `move_player` 函数的一个参数.

接下来开始编译代码, 我们没有办法列举出 `u8` 所有的可能值. 因为最后一个模式匹配的是前两个模式中未匹配到的部分. 通配模式的存在, 满足了 `match` 必须可穷举的要求. 需要注意的是我们必须将通配模式放在最后一个分支, 因为所有的模式都是按顺序匹配的. 如果我们在通配分支之后添加其他分支, Rust 会给出告警, 因为之后的分支永远不会被匹配.

Rust 还提供了一个模式, 如果我们不想要使用通配模式获取的值时, 可以使用 `_`, 这是个特殊的模式, 可以匹配任何值但并不会绑定到这个值中. 这告诉 Rust 我们不会使用这个值, 这样的话, Rust 就也不会给出告警.

现在改变游戏规则, 如果你掷到了3或者7之外的数字, 必须重新掷一次. 此时的场景就可以用到 `_`, 因此我们用这个模式去替换先前的 `other` 变量:

```rust 
let dice_roll = 9;
match dice_roll {
    3 => add_fancy_hat(),
    7 => remove_fancy_hat(),
    _ => reroll(),
}

fn add_fancy_hat() {}
fn remove_fancy_hat() {}
fn reroll() {}
```

这个例子同样也符合 Rust 可穷举的要求, 我们在最后的分支中显式地忽略了所有其他值, 并没有遗漏任何情况.

我们再次改变游戏规则, 如果掷到了3或者7之外的数字, 我们可以使用单元值(也就是空的元组类型)作为 `_` 分支的代码:

```rust
let dice_roll = 9;
match dice_roll {
    3 => add_fancy_hat(),
    7 => remove_fancy_hat(),
    _ => (),
}

fn add_fancy_hat() {}
fn remove_fancy_hat() {}
```

此时, 我们明确告诉 Rust 不会使用与前面模式不匹配的值, 并且在这种情况下不希望执行任何代码.

在第18章中我们还会讲到更多关于模式匹配的内容. 现在我们要开始学习 `if let` 语法, 当 `match` 表达式有点繁琐时, 可以使用.