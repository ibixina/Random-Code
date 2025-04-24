#include <stdio.h>
#include <time.h>

#define ITERATIONS 1000000

void multiply(int A[3][3], int B[3][3], int C[3][3]) {
    for (int i = 0; i < 3; i++) {
        // Manually unrolled inner loops
        C[i][0] = A[i][0]*B[0][0] + A[i][1]*B[1][0] + A[i][2]*B[2][0];
        C[i][1] = A[i][0]*B[0][1] + A[i][1]*B[1][1] + A[i][2]*B[2][1];
        C[i][2] = A[i][0]*B[0][2] + A[i][1]*B[1][2] + A[i][2]*B[2][2];
    }
}

int main() {
    int A[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    int B[3][3] = {{9, 8, 7}, {6, 5, 4}, {3, 2, 1}};
    int C[3][3];
    clock_t start, end;
    double cpu_time_used;

    start = clock();
    for (int n = 0; n < ITERATIONS; n++) {
        multiply(A, B, C);
    }
    end = clock();

    cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
    double time_per_mult = (cpu_time_used * 1e6) / ITERATIONS; // in microseconds
    printf("Time per multiplication: %.2f nanoseconds\n", time_per_mult * 1e3);

    // Prevent optimization removal
    printf("Result: %d\n", C[2][2]);
    return 0;
}
