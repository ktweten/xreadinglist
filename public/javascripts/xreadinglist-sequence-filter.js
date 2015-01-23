/**
 * Created by Kelly on 1/15/2015.
 */

function addToSequence(sequence, start, end) {
    if (sequence.length > 0) {
        sequence = sequence + ", ";
    }

    if (start === end) {
        sequence = sequence + end;
    } else {
        sequence = sequence + start + "-" + end;
    }
    return sequence;
}

angular.module('xReadingList').filter('sequence', function() {
    return function(numbers) {
        var index,
            startNumber,
            endNumber,
            sequenceString = "";

        if (numbers.length === 1) {
            sequenceString = numbers[0].number;
        } else if (numbers.length > 1) {
            startNumber = endNumber = numbers[0].number;

            for (index = 1; index < numbers.length; index += 1) {
                if (Number(numbers[index].number) === (Number(endNumber) +1)){
                    endNumber = numbers[index].number;
                } else {
                    sequenceString = addToSequence(sequenceString, startNumber, endNumber);
                    startNumber = endNumber = numbers[index].number;
                }

                if (index === numbers.length - 1) {
                    sequenceString = addToSequence(sequenceString, startNumber, endNumber);
                }
            }
        }

        return sequenceString;
    }
});
