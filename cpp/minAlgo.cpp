/* Minimizing the difference between the sumnation of the values in two seperate arrays
 * plus their count + 1. 
 * Ex of an array: [1,3,4] gives 12.
 * Second array: [6,5,2] gives 17.
 * This can be minimized by moving the 2 from the second array to the first one:
 * [1,3,4,2] returns 15.
 * [6,5] returns 14. 
 * The difference between the two is now 1 instead of 5.
 *
 * Assumptions: at least two values inputted.
 * - if odd number of values, first array gets the left over value.
 */

#include <iostream>
#include <vector>
#include <stdlib.h>
#include <cmath>

void printVec(std::vector<int> vec){
    for(int i = 0; i < vec.size(); i++){
        std::cout << vec[i] << '\t';
    }
    std::cout << std::endl;
}

int calcSize(std::vector<int> vec){
    //this assumes unit width == 1
    int length = 1;
    for(int i = 0; i < vec.size(); i++) {
       length++;
       length += vec[i];
    }
    return length;
}

//need to create a recursive function that keeps on minimizing the difference until can't optimize anymore
bool minimize(std::vector<int>& biggie, std::vector<int>& small, int biggieLength, int smallLength, int difference){
    //find number closest to half of difference
    //move to small vector, see if difference has become smaller
    int closestLoc = 0;
    int closest = biggie[closestLoc];
    for(int i = 1; i < biggie.size(); i++) {
        if(abs(closest - difference/2) > abs(biggie[i]-difference/2)) {
            closest = biggie[i];
            closestLoc = i;
        }
    }
    std::cout << "Best value to minimize difference: " << closest << std::endl;
    //test if this number will reduce the difference
    int newDiff = abs((biggieLength - (closest+1)) - (smallLength + (closest+1)));
    if(newDiff < difference)
    {
        std::cout << "New difference is: " << newDiff << std::endl;
        //swap
        //closest is the value, closestLoc indicates its location in current vector.
        biggie.erase(biggie.begin() + closestLoc); 
        small.push_back(closest);
        
        int firstLength = calcSize(biggie);
        int secondLength = calcSize(small);
        
        std::cout << "Length of first: " << firstLength << ". Length of second: " << secondLength << std::endl;
        int difference = abs(firstLength - secondLength);
        std::cout << "Current difference: " << difference << std::endl;

        if(firstLength > secondLength){
            minimize(biggie, small, firstLength, secondLength, difference);
        }
        else {
            minimize(small, biggie, secondLength, firstLength, difference);
        }

        return 0;
    }
    else //base case, ends recursion
    {
        std::cout << "Minimization doesn't optimize, the new difference would have been " << newDiff << std::endl;
        return 0;
    }
}

int main(int argc, char** argv) {
    if(argc < 3) {
        std::cout << "Need more arguments." << std::endl;
        return 1;
    }

    std::vector<int> first;
    std::vector<int> second;
    for(int i = 1; i < argc; i++)
    {
        if(i%2 == 1){
            first.push_back(atoi(argv[i]));
        }
        else {
            second.push_back(atoi(argv[i]));
        }
    }
    printVec(first);
    printVec(second);

    int length1 = calcSize(first);
    int length2 = calcSize(second);

    std::cout << "Length of first: " << length1 << ". Length of second: " << length2 << std::endl;
    int difference = abs(length1 - length2);
    std::cout << "Current difference: " << difference << std::endl;

    if(length1 > length2){
        minimize(first, second, length1, length2, difference);
    }
    else {
        minimize(second, first, length2, length1, difference);
    }

    printVec(first);
    printVec(second);
    return 0;
}
