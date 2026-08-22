class Parser {
    constructor() {
        this._string = '';
        this._tokenizer = new Tokenizer();
        this._tokenizer._operatorSet = /[+\-*\/()^√]/;
        this._tokenizer._numberSet = /[0-9]/;
        this._tokenizer._exeptionSet = /[.]/;
    }

    parse(string) {
        this._string = string;
        this._tokenizer.init(this._string);
        this._lookahead = this._tokenizer.getNextToken();

        return this.convertString();
    }

    convertString() {
        const result = [];

        while (this._lookahead !== null) {
            result.push(this.convertCurrent());
        }

        return result;
    }

    convertCurrent() {
        if (this._lookahead.type === 'Number') {
            return this.number();
        }

        if (this._lookahead.type === 'Operator') {
            return this.operator();
        }

        throw new SyntaxError('Unexpected token');
    }

    number() {
        const token = this._eat('Number');

        return {
            type: 'Number',
            value: Number(token.value)
        };
    }

    operator() {
        const token = this._eat('Operator');

        return {
            type: 'Operator',
            value: String(token.value)
        };
    }

    _eat(tokenType) {
        const token = this._lookahead;

        if (token === null) {
            throw new SyntaxError('End of input');
        }

        if (token.type !== tokenType) {
            throw new SyntaxError('Unexpected token');
        }

        this._lookahead = this._tokenizer.getNextToken();

        return token;
    }
}

class Tokenizer {
    _exeptionSet = [];
    _operatorSet = [];
    _numberSet = [];

    init(string) {
        this._string = string;
        this._cursor = 0;
    }

    hasMoreTokens() {
        return this._cursor < this._string.length;
    }

    getNextToken() {
        while (
            this.hasMoreTokens() &&
            /\s/.test(this._string[this._cursor])
        ) {
            this._cursor++;
        }

        if (!this.hasMoreTokens()) {
            return null;
        }

        const character = this._string[this._cursor];

        if (this._numberSet.test(character)) {
            var decimal = 0;
            const start = this._cursor;

            while (
                this.hasMoreTokens() &&
                /[0-9.]/.test(this._string[this._cursor])
            ) {
                if(this._string[this._cursor]=='.'){
                    if(decimal)
                        throw new SyntaxError('Unexpected character, too many .s');
                    decimal++;
                }
                this._cursor++;
            }

            const value = Number(
                this._string.slice(start, this._cursor)
            );

            return {
                type: 'Number',
                value: value,
            };
        }

        if(character == '-' && 
        !((this._numberSet).test(this._string[this._cursor-1])
        || this._string[this._cursor-1] == ' ')){
            this._cursor++;
            return {
                type: 'Operator',
                value: 'u'
            }
        };

        if (this._operatorSet.test(character)) {
            this._cursor++;
            return {
                type: 'Operator',
                value: character
            };
        }
        
        throw new SyntaxError(`Unexpected character: ${character}`);
    }
}

class Calculator {
    _parser = new Parser();
    _precedence = new Map();

    buildExpression(string) {
        const input = this._parser.parse(string);
        const buffer = [];
        const exit = [];

        for (const token of input) {
            const currentPrecedence = this._precedence.get(token.value);

            if(token.type == 'Number'){
                exit.push(token);
                continue;
            }

            if (token.value === '(') {
                buffer.push(token);
                continue;
            }

            if (token.value === ')') {
                while (buffer.length > 0 &&
                buffer[buffer.length - 1].value !== '(')
                    exit.push(buffer.pop());
                if (buffer.length === 0)
                    throw new SyntaxError('Unmatched closing parenthesis');
            
                buffer.pop();
                continue;
            }
            const rightAssociative = token.value === '^' || token.value === 'u';

            while (buffer.length > 0 && (
                currentPrecedence < this._precedence.get(buffer[buffer.length - 1].value)
                || (currentPrecedence === this._precedence.get(buffer[buffer.length-1] && !rightAssociative)))){
                exit.push(buffer.pop());
                }
            buffer.push(token);
        }

        while (buffer.length > 0) 
            exit.push(buffer.pop());

    return exit;
    }

    calculateExpression(expression){
        const buffer = [];

        for(const token of expression){
            if(token.type === 'Number'){
                buffer.push(token.value);
                continue;
            }
            if(token.type === 'Operator'){
                
                if (token.value === 'u') {
                    if (buffer.length < 1)
                        throw new SyntaxError("Invalid expression");

                    const right = buffer.pop();
                    buffer.push(-right);
                    continue;
                }

                if(buffer.length < 2) 
                    throw new SyntaxError("Invalid expression");

                const right = buffer.pop();
                const left = buffer.pop();

                switch (token.value) {
                    case '+':
                        buffer.push(left + right);
                        break;
                    case '-':
                        buffer.push(left - right);
                        break;
                    case '*':
                        buffer.push(left * right);
                        break;
                    case '/':
                        buffer.push(left / right);
                        break;
                    case '^':
                        buffer.push(left ** right);
                        break;
                    case '√':
                        buffer.push(left ** (1 / right));
                        break;
                   default:
                       throw new SyntaxError(
                       `Unknown operator: ${token.value}`);
                }
            }
        }
        if (buffer.length !== 1)
            throw new SyntaxError('Invalid expression');
    
    return buffer[0];
    }

}

const map = new Map();
map.set('(', 0);
map.set(')', 0);
map.set('+', 1);
map.set('-', 1);
map.set('/', 2);
map.set('*', 2);
map.set('^', 3);
map.set('√', 3);
map.set('u', 5);

export { Parser, Tokenizer, Calculator };