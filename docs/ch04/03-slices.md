- [4.3 Slice 类型](#43-slice-类型)
  - [字符串 slice](#字符串-slice)
  - [字符串字面量是 slice](#字符串字面量是-slice)
  - [字符串 Slice 作为参数](#字符串-slice-作为参数)
  - [其他类型的 Slice](#其他类型的-slice)
  - [总结](#总结)
### 4.3 Slice 类型

_Slices_ 使得我们能够引用集合中的一连串相邻元素, 而不需要引用整个集合. slice 是引用的其中一种类型, 因此它没有所有权.

现在有一个简单的编程题: 实现一个函数, 接受一个字符串作为函数参数, 函数最终返回字符串的首个单词. 如果函数没有从字符串中找到空格, 那么整个字符串就是一个单词, 此时返回整个字符串.

如果没有 Slice 类型的话, 函数将会是这样实现的:

```rust
fn first_word(s: &String) -> ?
```

`first_word` 函数接收 `&String` 作为参数. 我们不需要所有权, 因此这样是没有问题的. 但是我们的返回值应该是什么呢? Rust 中没有获取部分字符串的方法. 不过我们可以返回单词结尾的索引, 通过空格可以知道单词的结尾在哪里. 现在尝试创建以下代码(4-7):

```rust
fn first_word(s: &String) -> usize {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return i;
        }
    }

    s.len()
}

fn main() {}
```

因为我们需要遍历 `String` 中的每一个元素来确认某个值是否是空格, 所以用 `as_byte` 方法将 `String` 转换成字节数组:

```rust
fn first_word(s: &String) -> usize {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return i;
        }
    }

    s.len()
}

fn main() {}
```

接下来我们用 `iter` 方法在字节数组上创建一个迭代器:

```rust
fn first_word(s: &String) -> usize {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return i;
        }
    }

    s.len()
}

fn main() {}
```

我们会在[第 13 章](https://doc.rust-lang.org/book/ch13-02-iterators.html)讨论更多关于迭代器的细节. 现在只需要知道 `iter` 返回集合中的每一个元素, 而 `enumerate` 包装了 `iter` 的结果, 将这些元素作为元组的一部分来返回. `enumerate` 返回的元组中, 第一个元素是索引, 第二个是集合中元素的引用. 这比我们自己计算索引要更方便一些.

因为 `enumerate` 方法返回一个元组, 我们可以使用模式来解构这个元组. 在[第六章](https://doc.rust-lang.org/book/ch06-02-match.html#patterns-that-bind-to-values)中我们会介绍更多关于模式的概念. 在 `for` 循环中, 我们声明了一个模式: `i` 是元组中的索引, `&item` 则是元组中的单个字节. 因为从 `.iter().enumerate()` 中获取到的是引用, 因此我们需要在模式中使用 `&` .

在 `for` 循环中, 我们通过字节字面量语法来搜寻代表空格的部分. 如果找到了空格, 就会返回它所在的位置, 否则返回字符串的长度: `s.len()`:

现在我们知道了如何找到字符串中的第一个单词末尾索引的方法, 但是还存在一个问题. 我们只返回了一个 `usize` 类型的值, 可是这个值只有在 `&String` 存在的语境下才有意义. 也就是说, 因为它与 `String` 相互独立, 没有办法确保它在未来依然是合法的. 考虑代码 4-8 中的程序, 这里使用了 4-7 中的 `first_word` 函数:

```rust
fn first_word(s: &String) -> usize {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return i;
        }
    }

    s.len()
}

fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s); // word 最终的值是 5

    s.clear(); // 这段代码会将 String 清空, 使其值变成 ""

    // word 的值依然是 5, 但是没有更多的字符串让我们可以有效应用数值 5 了, 因为 word 的值现在完全无效!
    
}
```

以上程序编译时不会出现任何错误, 并且在调用 `s.clear()` 之后使用 `word` 也不会出错. 因为 `word` 和 `s` 的状态并没有任何关联, `word` 仍然包含值 `5`. 我们可以使用 `5` 和变量 `s` 来尝试提取出第一个单词, 但这其实是有问题的, 因为当我们在 `word` 中存储 `5` 之后 `s` 的内容就发生变化了.

这样的话, 我们就需要时时刻刻担心 `word` 的索引和 `s` 中所存储的数据不实时同步, 十分繁琐且很容易出问题. 如果我们的函数是 `second_word`, 管理索引的问题就更严重. 函数签名的内容就将会是这样:

```rust
fn second_word(s: &String) -> (usize, usize) {
```

现在我们要追踪起始和末尾的索引, 同时需要计算特定状态下更多与状态无关联的值的数据, 现在已经有三个不相关的变量飘忽不定, 但需要保持同步.

还好 Rust 提供了一种方式来解决这个问题: 字符串 slice.

#### 字符串 slice

**字符串 slice**(_string slice_) 是 `String` 中一部分值的引用, 类似如下这样:

```rust
fn main() {
    let s = String::from("hello world");

    let hello = &s[0..5];
    let world = &s[6..11];
}
```

`hello` 不是整个 `String` 的引用而是 `String` 中一部分内容的引用, 由 `[0..5]` 指定. 我们使用中括号的语法来划定一个范围 `[starting_index..ending_index]`, `starting_index` 是 slice 第一个位置的值, `ending_index` 则是 slice 最后一个位置的后一个值. 内部, slice 的数据结构存储了 slice 的起始位置和长度, 长度值为 `ending_index` 减去 `starting_index`. 因此在 `let world = &s[6..11];` 的情况下, `world` 是一个包含指向 `s` 索引 6 的指针的 slice, 它的长度值为 5.

用图表来呈现就是下面这样:

![4-6](/images/trpl04-06.svg)

我们用到了 Rust 的 `..` range 语法, 如果你想要从索引 0 开始, 可以省略 `..` 之前的值. 具体的代码将会是这样:

```rust
#![allow(unused)]
fn main() {
let s = String::from("hello");

let slice = &s[0..2];
let slice = &s[..2];
}
```

同样地, 如果你的 slice 包含 `String` 的最后一个字节, 也可以把 `..` 之后的值省略. 看下面的代码, 最后两行代码的结果是一致的:

```rust
#![allow(unused)]
fn main() {
    let s = String::from("hello");

    let len = s.len();

    let slice = &s[3..len];
    let slice = &s[3..];
}
````

如果 `..` 前后都省略了, 那么 slice 就是整个字符串. 因此下面的结果一致:

```rust

#![allow(unused)]
fn main() {
let s = String::from("hello");

let len = s.len();

let slice = &s[0..len];
let slice = &s[..];
}

```


> 注意: 字符串 slice range 的索引必须位于有效的 UTF-8 字符边界内. 如果你试图在多字节字符之间创建字符串 slice, 程序就会异常退出. 在本章我们为了更好地介绍字符串 slice 的概念, 只使用 ASCII 字符集. 在第 8 章: [使用字符串存储 UTF-8 编码的文本](https://doc.rust-lang.org/book/ch08-02-strings.html#storing-utf-8-encoded-text-with-strings) 部分, 我们会更加详细地探讨 UTF-8 的处理问题.

现在我们已经了解了需要了解的信息, 开始修改 `first_word` 函数来返回 slice. 标识字符串 slice 的类型被写作: `&str`:

```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

fn main() {}
```

和在代码示例 4-7 中一样, 我们通过寻找字符串中的空格获取了单词结尾的索引. 当我们找到一个空格时, 就返回一个字符串 slice, 这个 slice 用字符串的开始位置作为开始索引, 空格位置作为结束索引.

现在当我们调用 `first_word` 函数, 会返回与底层数据关联的单个值. 这个值由 slice 开始位置的引用和 slice 中元素的数量组成.

`second_word` 方法也可以返回一个 slice:

```rust
fn second_word(s: &String) -> &str {
```

现在我们有了一个更简单不易混淆的 API, 因为编译器会确保 `String` 的引用始终保持合法. 再回顾代码示例 4-8 中的 bug, 当我们获取第一个单词结尾的索引后, 就把字符串清除了, 这导致我们的索引变成了无效. 那部分代码在逻辑上不正确, 但是不会直接抛出错误. 当我们后续尝试使用空字符串的第一个索引时, 错误就会抛出来了. 不过现在我们知道了 slice, 使用 slice 就能避免这个错误, 并且帮助我们提前发现代码中的问题. 如果把 `first_word` 改成 slice 版本, 在编译阶段就会抛出错误:

```rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

fn main() {
    let mut s = String::from("hello world");

    let word = first_word(&s);

    s.clear(); // error!

    println!("the first word is: {}", word);
}
```

具体的错误信息如下:

```shell
$ cargo run
   Compiling ownership v0.1.0 (file:///projects/ownership)
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
  --> src/main.rs:18:5
   |
16 |     let word = first_word(&s);
   |                           -- immutable borrow occurs here
17 | 
18 |     s.clear(); // error!
   |     ^^^^^^^^^ mutable borrow occurs here
19 | 
20 |     println!("the first word is: {}", word);
   |                                       ---- immutable borrow later used here

For more information about this error, try `rustc --explain E0502`.
error: could not compile `ownership` due to previous error
```

回想一下借用的规则, 如果我们对于某个值有一个不可变引用, 就不能再获取一个可变引用了. 因为调用 `clear` 方法之后, 就会清空 `String`, 要实现这一步必须要获取可变引用. 在调用完 `clear` 方法之后, `println!` 需要使用 `word` 的引用, 因此此时不可变引用必须保持可用的状态. Rust 不允许 `clear` 中的可变引用和 `word` 中的不可变引用同时存在, 因此编译会失败. Rust 不仅使得我们的 API 更容易使用, 还能够帮助我们在编译阶段消除一整类的错误!

#### 字符串字面量是 slice

还记得我们之前提到字符串字面量被存储在二进制文件中. 现在我们已经了解了 slice, 那么就能够更好地理解字符串字面量:

```rust
#![allow(unused)]
fn main() {
let s = "Hello, world!";
}
```

`s` 在这里属于 `&str` 类型: 它是一个指向二进制程序特定位置的 slice. 这也是为什么字符串字面量不可变的原因; `&str` 是一个不可变引用.

#### 字符串 Slice 作为参数

知道了能够获取字面量的 slice 和 `String` 的值之后, 我们可以对 `first_word` 进行改进, 这是它的签名:

```rust
fn first_word(s: &String) -> &str {
```

更有经验的 rust 开发者所编写的函数签名将会是如下代码 4-9 这样, 因为这样的话, 参数的类型可以是 `&String` 也可以是 `&str`.

```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

fn main() {
    let my_string = String::from("hello world");

    // `first_word` 支持接受 String 类型, 也支持 String 的 slice 作为参数
    let word = first_word(&my_string[0..6]);
    let word = first_word(&my_string[..]);
    // `first_word` 还支持接受 String 类型的引用, 和整个 String 无异
    let word = first_word(&my_string);

    let my_string_literal = "hello world";

    // `first_word` 同样接受 String 字面量的 slice, 不管是全部还是部分
    let word = first_word(&my_string_literal[0..6]);
    let word = first_word(&my_string_literal[..]);

    // 因为 string 字面量也属于 string 的 slice
    // 因此下面的代码也是有效的

    let word = first_word(my_string_literal);
}
```

如果现在有一个字符串 slice, 我们可以直接将其作为参数传入. 如果有一个 `String`, 可以传递这个 `String` 的 slice, 或者这个 `String` 的引用. 这种灵活性利用了 _deref coercions_ 的优势, 我们会在第15章的[函数和方法隐式 Deref 强制转换](https://doc.rust-lang.org/book/ch15-02-deref.html#implicit-deref-coercions-with-functions-and-methods)部分中对这个特性进行介绍. 定义一个函数, 接受字符串 slice 而不是 `String` 的引用使得我们的 API 更加通用且不会有任何功能的缺失:

```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[0..i];
        }
    }

    &s[..]
}

fn main() {
    let my_string = String::from("hello world");

    // `first_word` 接受字符串 slice, 不管是全部还是部分
    let word = first_word(&my_string[0..6]);
    let word = first_word(&my_string[..]);
    // `first_word` 同样接受 String 的引用, 和字符串的整个 slice 无异 
    let word = first_word(&my_string);

    let my_string_literal = "hello world";

    // `first_word` 同样接受 String 字面量的 slice, 不管是全部还是部分
    let word = first_word(&my_string_literal[0..6]);
    let word = first_word(&my_string_literal[..]);

    // 因为字符串字面量本身就是字符串 slice, 所以以下语法依然生效
    let word = first_word(my_string_literal);
}
```

#### 其他类型的 Slice

截止目前, 我们讲到的 slice 只针对字符串. 当然有些其他类型的数据也有 slice. 查看以下数组:

```rust
#![allow(unused)]
fn main() {
let a = [1, 2, 3, 4, 5];
}
```

正如想要引用字符串的一部分一样, 我们也会想要引用数组的一部分. 可以这样操作:

```rust
#![allow(unused)]
fn main() {
let a = [1, 2, 3, 4, 5];

let slice = &a[1..3];

assert_eq!(slice, &[2, 3]);
}
```

这个 slice 的类型是 `&[i32]`. 和字符串 slice 的工作机制一样, 都是通过存储第一个元素的引用和集合的长度实现的. 对于任何其他类型的集合, 你都可以使用这类 slice. 在第 8 章谈到向量(vector)的时候, 我们会讨论更多关于这些集合的细节.

#### 总结

所有权, 借用, slice 的概念确保了 Rust 程序在编译阶段的内存安全. 和其他系统编程语言一样, Rust 也给了开发者管理内存的控制权. 在 Rust 中还有一点好处就是, 当数据的所有者跳出作用域之后, 数据就会被清空, 这表明我们不再需要额外自己实现和调试控制相关的代码.

所有权的概念对 Rust 很多其他部分的工作机制也有所影响, 因此在本书的剩余部分, 我们也会讨论到更多相关的概念. 现在我们开始第五章的学习: 如何将多份数据组合进一个 `struct` 中.