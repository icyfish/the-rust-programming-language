[[toc]]

## 安装

第一步是安装 Rust, 我们通过 `rustup` 下载 Rust, `rustup` 是一个命令行工具, 用来管理 Rust 的版本和相关的工具. 下载 Rust 需要联网.

::: tip 注意
如果你由于某些原因不想要使用 `rustup`, 可以查看其他 [Rust 的安装方法](https://forge.rust-lang.org/infra/other-installation-methods.html)
:::

接下来的步骤会安装 Rust 编译器的最新稳定版. Rust 的稳定版本能够确保本书中的所有代码示例都能够正常运行, 不过最终输出的结果可能会因版本有所差异, 因为 Rust 经常会改进错误和警示信息. 也就是说, 我们使用以下步骤安装的任何稳定新版本 Rust, 其输出结果都会如本书所呈现.

::: tip 命令行标识
在本章和全书中, 会展示一些在终端中呈现的指令. 所有输入的指令都以 `$` 开头, 但你并不需要输入 `$`; 这个符号表示指令的起点. 没有以 `$` 开头的各行都是以以上输入指令的输出结果. 除此之外, PowerShell 专用的示例的标识是 `>` 而不是 `$`.
:::

### 在 Linux 或 macOS 中安装 `rustup`

如果你的操作系统是 Linux 或者 macOS, 可以在终端中输入以下指令

```shell
$ curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

以上指令会下载一个脚本并开始按照 `rustup` 工具, 并安装最新稳定版本的 Rust. 过程中或许会弹出需要密码的弹框. 如果安装成功的话, 会看到下面的提示消息:

```
Rust is installed now. Great!
```

除此之外还需要一个链接器(linker), Rust 用这个程序来合并编译输出结果到一个文件中. 不过很可能你的设备中已经安装了链接器. 如果过程中遇到了链接器错误, 可以安装一个 C 编译器, 通常包含一个链接器. C 编译器也很有用, 因为许多常见的 Rust 包依赖 C 代码, 需要 C 编译器.

```shell
$ xcode-select --install
```

Linux 用户需要根据其发行版本的文档安装 GCC(GNU Compiler Collection - GNU 编译器套装) 或者 Clang 编译器. 例如, 如果你使用 Ubuntu, 就要安装 `build-essential` 包.

### 在 Windows 上安装 `rustup`

在 Windows 上的安装方式, 可以根据[https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)中的步骤进行. 在安装过程中, 应该会收到一条信息, 解释你需要为 Visual Studio 2013(或更新的版本) 安装 C++ 构建工具. 最简单的获取构建工具的方式是安装[Build Tools for Visual Studio 2019](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/). 安装过程中如果需要选择工作套件, 确保选上"C++ 构建工具"以及 Windows 10 SDK 和英文语言包组件.

本书后面列出的指令可以通知在 `cmd.exe` 和 PowerShell 中执行. 如果某些指令在两个程序中有差别, 我们会做出专门的解释.

### 更新和卸载

如果你已经使用 `rustup` 安装了 Rust, 更新到最新版本十分容易. 在 shell 中运行下面的更新脚本:

```shell
$ rustup update
```

使用 `rustup` 执行的卸载脚本则如下:

```shell
$ rustup self uninstall
```

### 排障

下面的脚本可以确认你是否正确安装了 Rust:

```shell
$ rustc --version
```

执行以上脚本之后能看到所安装的 Rust 最新稳定版本信息, 提交的哈希值, 以及提交的日期以下面这样的形式呈现:

```
rustc x.y.z (abcabcabc yyyy-mm-dd)
```

如果看到了以上信息, 说明你成功安装了 Rust! 如果没有看到或者是在 Window 系统, 检查系统变量 `%PATH%` 中是否含有 Rust. 如果这些都确认没问题但是 Rust 依然没有成功安装, 可以在许多地方寻求帮助. 最方便的方式是在 [Rust 官方 Discord](https://discord.com/invite/rust-lang) 中的 #beginners 频道. 可以在这里与其他 Rust 用户们交流获取帮助. 其他资源还包括[Rust 用户论坛](https://users.rust-lang.org/)和 [StackOverflow](https://stackoverflow.com/questions/tagged/rust)


### 本地文档

安装 Rust 的同时还会在本地安装文档的拷贝, 因此我们可以离线查看文档. 执行 `rustup doc` 就能够在浏览器中打开离线文档. 

无论何时, 只要你不确定标准库提供的类型或者方法的含义或使用方法, 都可以查阅应用程序接口(API)文档进行确认!