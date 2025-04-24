#include <iostream>
#include <cstdlib>  // For abs() function

using namespace std;

int main() {
    unsigned long long a, b;
    while (cin >> a >> b) {
        cout << (a > b ? a - b : b - a) << endl;
    }
    return 0;
}

