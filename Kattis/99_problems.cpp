    #include <iostream>
    #include <math.h>
     
    using namespace std;

    
    int main() {

        int n;
        cin >> n;

        if (n < 249){
            cout << 99 << endl;
            return 0;
        }
        int lower = n/100 * 100 - 1;
        int upper = n/100 * 100 + 99;

        int upperDist = upper - n;
        int lowerDist = n - lower;

        cout << upperDist << " " << lowerDist << endl;
        cout << ( (upperDist <= lowerDist) ? upper : lower ) << endl;
    }

