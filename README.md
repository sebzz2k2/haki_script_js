# haki-script

## haki-script is a interpreter for a custom language called haki-script

### Usage

To install dependencies:

```bash
bun install
```

To run: With file name

```bash
bun run index.ts <path to file>
```

- use file .haki extension

To run: With code

```bash
bun run index.ts
```

### Syntax

#### Variables

- let _variable_name_ = _value_ ;
- const _variable_name_ = _value_ ;
- can use boolens and numbers

#### Functions

- fn _function_name_ ( _arguments_ ) { _function_body_ }

#### Objects

- { _key_: _value_, _key_: _value_ }

#### Operators

- add: +
- subtract: -
- multiply: \*
- divide: /

### sample code

```js
fn foo(a) {
    let x = 12-a;
    let y = 10;
    let z = x / y *2 ;
    z

}
let foo_Val = foo(12+2);
print(foo_Val);
```
