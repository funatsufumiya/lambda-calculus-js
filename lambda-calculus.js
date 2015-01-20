(function(G){ // G = global or window

  var genvar_count = 0;
  var oldvarMap = [];

  /* return String */
  function generateVarName(old){ // Generate New Variable Name
    oldvarMap[genvar_count] = old; // Store old var-name
    var v = "g"+genvar_count;
    ++genvar_count;
    return v;
  }

  /* return Expr */
  function identifyArgs(e, args, aliases){ // Avoid duplicated args
    if(e instanceof Apply){
      return new Apply(
        identifyArgs(e.e1, args, aliases),
        identifyArgs(e.e2, args, aliases));

    }else if(e instanceof Var){
      var id = args.lastIndexOf(e.name);
      return (id > -1)? new Var(aliases[id]): e;

    }else if(e instanceof Lambda){
      var alias = generateVarName(e.arg);
      args.push(e.arg);
      aliases.push(alias);
      return new Lambda(alias, identifyArgs(e.body, args, aliases));

    }
  }

  function resolveArg(e, arg, value){ // (\x.x) a -> convert x to a
    if(e instanceof Var){
      if(e.name == arg){
        return value;
      }else{
        return e;
      }
    }else if(e instanceof Apply){
      return new Apply(
        resolveArg(e.e1, arg, value),
        resolveArg(e.e2, arg, value));
    }else if(e instanceof Lambda){
      return new Lambda(e.arg, resolveArg(e.body, arg, value));
    }
  }

  /* return Expr */
  function solveStep(e){
    if(e instanceof Apply){
      if(e.e1 instanceof Lambda){
        var lm = e.e1;
        return resolveArg(lm.body, lm.arg, e.e2);
      }else{ // Apply
        return new Apply(solveStep(e.e1), solveStep(e.e2));
      }
    }else if(e instanceof Lambda){
      return new Lambda(e.arg, solveStep(e.body));
    }else if(e instanceof Var){
      return e;
    }
  }

  /* return Boolean */
  function isSolved(e){
    if(e instanceof Apply){
      if(e.e1 instanceof Lambda){
        return false;
      }else{
        return isSolved(e.e1) && isSolved(e.e2);
      }
    }else if(e instanceof Lambda){
      return isSolved(e.body);
    }else if(e instanceof Var){
      return true;
    }
  }

  /* return Expr */
  function fixGenVars(e){ // return not genvar-ed version
    if(e instanceof Var){
      if(/^g\d+$/.test(e.name)){
        var id = +(e.name.slice(1));
        return new Var(oldvarMap[id]);
      }else{
        return e;
      }
    }else if(e instanceof Apply){
      return new Apply(fixGenVars(e.e1), fixGenVars(e.e2));
    }else if(e instanceof Lambda){
      var arg = e.arg;
      if(/^g\d+$/.test(arg)){
        var id = +(arg.slice(1));
        arg = oldvarMap[id];
      }

      return new Lambda(arg, fixGenVars(e.body));
    }
  }

  /* return Expr */
  function solve(e){
    var ret = solve0(e);
    return fixGenVars(ret);
  }

  /* return Expr */
  function solve0(e){ // return genvar-ed version
    var e = identifyArgs(e, [], []); // avoid duplicated args

    var ret = e;
    while(!isSolved(ret)){
      ret = solveStep(ret);
    }
    return ret;
  }

  /* return String */
  function stringify(e){ // expr.toString()
    if(e instanceof Apply){
      return "("+stringify(e.e1)+" "+stringify(e.e2)+")";
    }else if(e instanceof Lambda){
      return "(λ"+e.arg+"."+stringify(e.body)+")";
    }else if(e instanceof Var){
      return e.name;
    }
  }

  function Lambda(arg, body){
    this.arg = arg;
    this.body = body;
    this.solve = function(){ return solve(this); }
    this.solve0 = function(){ return solve0(this); }
    this.toString = function(){ return stringify(this); }
  }

  function Apply(e1,e2){
    this.e1 = e1;
    this.e2 = e2;
    this.solve = function(){ return solve(this); }
    this.solve0 = function(){ return solve0(this); }
    this.toString = function(){ return stringify(this); }
  }

  function Var(name){
    this.name = name;
    this.solve = function(){ return solve(this); }
    this.solve0 = function(){ return solve0(this); }
    this.toString = function(){ return stringify(this); }
  }

  var L = function(arg,body){ return new Lambda(arg,body); }
  var _ = function(e1,e2){ return new Apply(e1,e2); }
  var v = function(name){ return new Var(name); }

  if(typeof LC_CONFIG != 'undefined'){
    var c = LC_CONFIG;
    G[c['lambda']] = L;
    G[c['apply']] = _;
    G[c['var']] = v;
  }else{
    G.L = L;
    G._ = _;
    G.v = v;
  }

  // For Debug
  G.isSolved = isSolved;
  G.solveStep = solveStep;

})(this);