## 4. 理解所有权

所有权在 Rust 中是最特别的特性, 也深刻地影响语言中的其他部分. 这个特性使得 Rust 在不需要垃圾回收机制的情况下能够更加安全地处理内存, 因此了解所有权的工作机制很重要. 本章会探讨所有权和其他与之相关的特性: 借用(borrowing), 切片(slices) 以及 Rust 如何在内存中分配数据.