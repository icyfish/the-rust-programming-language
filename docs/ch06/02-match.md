[[toc]]

[Original](https://doc.rust-lang.org/stable/book/ch06-02-match.html)

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



