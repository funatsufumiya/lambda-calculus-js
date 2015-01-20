# lambda-calculus.js

Lambda Calculus Solver for JavaScript

## Downloads

- [lambda-calculus.min.js](https://raw.githubusercontent.com/atmarksharp/lambda-calculus-js/master/lambda-calculus.min.js)
- [lambda-calculus.js](https://raw.githubusercontent.com/atmarksharp/lambda-calculus-js/master/lambda-calculus.js)

## Usage

- Add `<script src="path/to/lambda-calculus.js"></script>` to the header

```javascript
v('x') // Variable x
L('x',v('x')) // Lambda \x.x
_(v('a'),v('b')) // Application of (a b)

lambda.solve() // Solve (Simplify) a lambda expression
lambda.toString() // Get human readable expression as string

var f = L('x',v('x')) // \x.x
var f_a = _(f, v('a')) // (\x.x) a

console.log( f_a.solve().toString() ) // a
```

### Differences between expr.solve() and expr.solve0()

When the `expr` is solved, arguments and variables are temporarily converted to g1, g2, g3...gN.

- `expr.solve()` returns the solved expression that has the restored names like `λx.λy.x`. These may be wrong naming for some reasons.

- `expr.solve0()` returns the solved expression that has temporary names like `λg1.λg2.g1`. These nanes are correct, but they are difficult to read.

### Rename v, L and _

```html
<script>
  var LC_CONFIG = {
    variable: "val",
    lambda: "lambda",
    apply: "apply",
  }
</script>
<script src="path/to/lambda-calculus.js"></script>
<script>
  console.log( lambda('x',val('x')) );
</script>
```

## Samples

### If, True and False

```javascript
var _true = L('x',L('y',v('x'))); // λxy.x
var _false = L('x',L('y',v('y'))); // λxy.y
var _if = L('x',L('y',L('z',_(_(v('x'), v('y')),v('z'))))); // λxyz.xyz

var if_t_t_f = _(_(_(_if,_true),_true),_false).solve(); // (if true true false)
var if_f_t_f = _(_(_(_if,_false),_true),_false).solve(); // (if false true false)

console.log("(if true true false) = " + if_t_t_f.toString()); // (λx.(λy.x)) (= true)
console.log("(if false true false) = " + if_f_t_f.toString()); // (λx.(λy.y)) (= false)
``` 

### Church Numbers

```javascript
var _0 = L('f',L('x',v('x'))); // λfx.x
var _1 = L('f',L('x',_(v('f'),v('x')))); // λfx.fx
var _2 = L('f',L('x',_(v('f'),_(v('f'),v('x'))))); // λfx.f(fx)
var _3 = L('f',L('x',_(v('f'),_(v('f'),_(v('f'),v('x')))))); // λfx.f(f(fx))

var succ = L('n',L('f',L('x',_(v('f'),_(_(v('n'),v('f')),v('x')))))); // λnfx.f(nfx)

var succ_0 = _(succ, _0).solve(); // (succ 0)
var succ_1 = _(succ, _1).solve(); // (succ 1)

console.log("(succ 0) = " + succ_0); // λfx.fx (= 1)
console.log("(succ 1) = " + succ_1); // λfx.f(fx) (= 2)
```

## License

You can copy, share and modify, without any conditions.