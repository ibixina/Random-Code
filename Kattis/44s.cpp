#include <iostream>
#include <string>
#include <math.h>
#include <stack>
#include <cctype>
using namespace std;

// Function to apply a binary operation
double applyOperator(double a, double b, char op) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': 
            if (b == 0) {
                cerr << "Error: Division by zero!" << endl;
                return 0;
            }
            return a / b;
        default: return 0;
    }
}

// Function to evaluate a given expression string with operator precedence
double evaluateExpression(const string& expression) {
    stack<double> values;      // Stack to store numbers
    stack<char> ops;           // Stack to store operators

    int i = 0;
    while (i < expression.length()) {
        if (isspace(expression[i])) {
            // Skip spaces
            i++;
            continue;
        }

        if (isdigit(expression[i])) {
            // If current character is a digit, form the number and push it to values stack
            double val = 0;
            while (i < expression.length() && isdigit(expression[i])) {
                val = val * 10 + (expression[i] - '0');
                i++;
            }
            values.push(val);
        } else if (expression[i] == '(') {
            // If current character is '(', push it to ops stack
            ops.push(expression[i]);
            i++;
        } else if (expression[i] == ')') {
            // If current character is ')', process the operators until '('
            while (!ops.empty() && ops.top() != '(') {
                double val2 = values.top();
                values.pop();
                double val1 = values.top();
                values.pop();
                char op = ops.top();
                ops.pop();
                values.push(applyOperator(val1, val2, op));
            }
            ops.pop(); // Pop '('
            i++;
        } else if (expression[i] == '+' || expression[i] == '-' || expression[i] == '*' || expression[i] == '/') {
            // If current character is an operator
            while (!ops.empty() && ((ops.top() == '*' || ops.top() == '/') || 
                   (ops.top() == '+' || ops.top() == '-') && (expression[i] == '+' || expression[i] == '-'))) {
                // Apply operator with higher or equal precedence
                double val2 = values.top();
                values.pop();
                double val1 = values.top();
                values.pop();
                char op = ops.top();
                ops.pop();
                values.push(applyOperator(val1, val2, op));
            }
            // Push the current operator to ops stack
            ops.push(expression[i]);
            i++;
        }
    }

    // Process all remaining operators in the ops stack
    while (!ops.empty()) {
        double val2 = values.top();
        values.pop();
        double val1 = values.top();
        values.pop();
        char op = ops.top();
        ops.pop();
        values.push(applyOperator(val1, val2, op));
    }

    // Final result is the only value left in the values stack
    return values.top();
}


int main() {

    int n;

    cin >> n;
    while (n--){
        int target;
        cin >> target;

        bool found = false;

        char signs[4] = {'+', '-', '*', '/'};
        for (char sign1 : signs ){
            for (char sign2 : signs){
                for (char sign3 : signs){
                        string format = "4 " + string(1, sign1) + " 4 " + string(1, sign2) + " 4 " + string(1, sign3) + " 4 ";

                        // Manually evaluate the expression using the current operators
                        double result = evaluateExpression(format);
                        if (result == target){
                            cout << format << "= " << target << endl;
                            found = true;
                            break;
                        }
                }
                if (found) break;
            }
            
            if (found) break;

        }

        if (!found){

        cout << "no solution" << endl;
        }

    }  
}

