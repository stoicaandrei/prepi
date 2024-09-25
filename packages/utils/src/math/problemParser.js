const rege = /^(floor|ceil|sqrt|log_\d{1}|log|log2|ln|(sin|cos|tan|sec|csc|cot)h?)$/;

const CALC_CONST = {
  // define your constants
  e: 2.718,
  pi: 3.141,
  infty: 2e10 - 1,
  x: 245,
  y: 246,
  k: 247,
  c: 0,
  C: 0,
};

const CALC_NUMARGS = [[/^(\^|\*|\/|\+|\-)$/, 2], [rege, 1]];

export const ProblemParser = function(expr) {
  this.valid = true;
  this.expr = expr;
  // console.error(expr);

  const OpPrecedence = function(op) {
    if (typeof op == 'undefined') return 0;

    return op.match(rege)
      ? 10
      : op === '^'
      ? 9
      : op === '*' || op === '/'
      ? 8
      : op === '+' || op === '-'
      ? 7
      : 0;
  };

  const OpAssociativity = function(op) {
    return op.match(rege) ? 'R' : 'L';
  };

  const numArgs = function(op) {
    for (let i = 0; i < CALC_NUMARGS.length; i++) {
      if (CALC_NUMARGS[i][0].test(op)) return CALC_NUMARGS[i][1];
    }
    return false;
  };

  this.rpn_expr = [];
  let rpn_expr = this.rpn_expr;

  this.expr = this.expr.replace(/\s+/g, '');

  // This nice long regex matches any valid token in a user
  // supplied expression (e.g. an operator, a constant or
  // a variable)
  const in_tokens = this.expr.match(/(\^|\*|\/|\+|\-|\(|\)|[a-zA-Z0-9_\.]+)/gi);
  let op_stack = [];

  in_tokens.forEach(function(token) {
    if (CALC_CONST.hasOwnProperty(token)) {
      // Constant. Pushes a value onto the stack.
      rpn_expr.push(['num', CALC_CONST[token]]);
    } else if (/^[a-zA-Z]$/.test(token)) {
      // Variables (i.e. x as in f(x))
      rpn_expr.push(['var', token]);
    } else {
      const numVal = parseFloat(token);
      if (!isNaN(numVal)) {
        // Number - push onto the stack
        rpn_expr.push(['num', numVal]);
      } else if (token === ')') {
        // Pop tokens off the op_stack onto the rpn_expr until we reach the matching (
        while (
          op_stack[op_stack.length - 1] !== '(' &&
          op_stack[op_stack.length - 1] !== '['
        ) {
          rpn_expr.push([
            numArgs(op_stack[op_stack.length - 1]),
            op_stack.pop(),
          ]);
          if (op_stack.length === 0) {
            this.valid = false;
            return;
          }
        }

        // remove the (
        op_stack.pop();
      } else if (token === '(') {
        op_stack.push(token);
      } else {
        // Operator
        let tokPrec = OpPrecedence(token),
          headPrec = OpPrecedence(op_stack[op_stack.length - 1]);

        while (
          (OpAssociativity(token) === 'L' && tokPrec <= headPrec) ||
          (OpAssociativity(token) === 'R' && tokPrec < headPrec)
        ) {
          rpn_expr.push([
            numArgs(op_stack[op_stack.length - 1]),
            op_stack.pop(),
          ]);
          if (op_stack.length === 0) break;

          headPrec = OpPrecedence(op_stack[op_stack.length - 1]);
        }

        op_stack.push(token);
      }
    }
  });

  // Push all remaining operators onto the final expression
  while (op_stack.length > 0) {
    const popped = op_stack.pop();
    if (popped === ')') {
      this.valid = false;
      break;
    }
    rpn_expr.push([numArgs(popped), popped]);
  }
};

/**
 * returns the result of evaluating the current expression
 */
ProblemParser.prototype.eval = function(x) {
  let stack = [],
    rpn_expr = this.rpn_expr;

  // console.log('rpn_expr', rpn_expr);
  rpn_expr.forEach(function(token) {
    if (typeof token[0] == 'string') {
      switch (token[0]) {
        case 'var':
          // Variable, i.e. x as in f(x); push value onto stack
          //if (token[1] != "x") return false;
          stack.push(x);
          break;

        case 'num':
          // Number; push value onto stack
          stack.push(token[1]);
          break;
      }
    } else {
      // Operator

      const numArgs = token[0];
      let args = [];
      do {
        args.unshift(stack.pop());
      } while (args.length < numArgs);

      switch (token[1]) {
        /* BASIC ARITHMETIC OPERATORS */
        case '*':
          stack.push(args[0] * args[1]);
          break;
        case '/':
          stack.push(args[0] / args[1]);
          break;
        case '+':
          stack.push((args[0] ? args[0] : 0) + (args[1] ? args[1] : 0));
          break;
        case '-':
          stack.push((args[0] ? args[0] : 0) - (args[1] ? args[1] : 0));
          break;

        // exponents
        case '^':
          stack.push(
            args[1] > 0
              ? Math.pow(args[0], args[1])
              : 1 / Math.pow(args[0], -args[1])
          );
          break;

        /* TRIG FUNCTIONS */
        case 'sin':
          stack.push(Math.sin(args[0]));
          break;
        case 'cos':
          stack.push(Math.cos(args[0]));
          break;
        case 'tan':
          stack.push(Math.tan(args[0]));
          break;
        case 'tg':
          stack.push(Math.tan(args[0]));
          break;
        case 'sec':
          stack.push(1 / Math.cos(args[0]));
          break;
        case 'csc':
          stack.push(1 / Math.sin(args[0]));
          break;
        case 'cot':
          stack.push(1 / Math.tan(args[0]));
          break;
        case 'ctg':
          stack.push(1 / Math.tan(args[0]));
          break;
        case 'arcsin':
          stack.push(Math.asin(args[0]));
          break;
        case 'arccos':
          stack.push(Math.acos(args[0]));
          break;
        case 'arctan':
          stack.push(Math.atan(args[0]));
          break;

        case 'floor':
          stack.push(Math.floor(args[0]));
          break;
        case 'ceil':
          stack.push(Math.ceil(args[0]));
          break;
        case 'sqrt':
          stack.push(Math.sqrt(args[0]));
          break;
        case 'log':
          stack.push(Math.log10(args[0]));
          break;
        case 'ln':
          stack.push(Math.log(args[0]));
          break;
        case 'log_two':
          stack.push(Math.log2(args[0]));
          break;

        default:
          // unknown operator; error out
          if (token[1] && token[1].includes('log_')) {
            stack.push(
              Math.log(args[0]) /
                Math.log(
                  [
                    'three',
                    'four',
                    'five',
                    'six',
                    'seven',
                    'eight',
                    'nine',
                  ].indexOf(token[1].split('_')[1]) + 3
                )
            );
          } else {
            return false;
          }
      }
    }
  });
  const final = stack.pop();
  // console.log(final);
  return final;
};
