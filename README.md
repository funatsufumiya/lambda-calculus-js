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

- `expr.solve0()` return the solved expression that has temporary names like `λg1.λg2.g1`. These nanes are always correct names, but they are difficult to read.

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

### cond, true, false

```javascript
var _true = L('x',L('y',v('x'))); // λxy.x
var _false = L('x',L('y',v('y'))); // λxy.y
var cond = L('x',L('y',L('z',_(_(v('x'), v('y')),v('z'))))); // λxyz.xyz

var cond_t_t_f = _(_(_(cond,_true),_true),_false).solve(); // (cond true true false)
var cond_f_t_f = _(_(_(cond,_false),_true),_false).solve(); // (cond false true false)

console.log("(cond true true false) = " + cond_t_t_f.toString()); // (λx.(λy.x))
console.log("(cond false true false) = " + cond_f_t_f.toString()); // (λx.(λy.y))
```

## License

You can copy, share and modify, without any conditions.