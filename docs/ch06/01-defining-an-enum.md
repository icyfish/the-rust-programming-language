[[toc]]

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

