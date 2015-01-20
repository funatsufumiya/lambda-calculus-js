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

## License

You can copy, share and modify, without any conditions.