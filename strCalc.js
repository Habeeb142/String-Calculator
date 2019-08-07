$(document).ready(function(){
    //setting all initial variables
    $('#strVal').prop('disabled', 'true');
    $('#strVal').css('cursor', 'not-allowed');
    $('#strVal').prop('placeholder', 'Please Press the Power Button');
    $("#result").val('Please Press the Power Button for result');
    var power = 'off';
    
    //setting power toggle
    $('#power').click(function(){
        switch(power){
            //what to do when power off is pressed
            case 'off':
                $('#strVal').css({"cursor" : "text", "border-left" : "5px solid #1ebf5e"});
                $('#power').css({"border" : "1px solid #1ebf5e", "border-left" : "7px solid red", "border-right" : "7px solid red"});
                $('#power').text('OFF');
                power = 'on';
                $("#result").val('0');
                $('#strVal').removeAttr('disabled');
                $('#strVal').focus();
            break;

            case 'on':
            //what to do when power off is pressed
                $('#strVal').prop('disabled', 'true');
                $('#power').text('ON');
                $('#strVal').css({"cursor" : "not-allowed", "border-left" : "5px solid red"});
                $("#result").val('Please Press the Power Button for result');
                power = 'off'; 
                $('#strVal').prop('placeholder', 'Please Press the Power Button');
                $('#strVal').val('');
            break;  
        
        }
    })

    //doing the calculation
    $('#strVal').keyup(function(event){
        problem();
    })

        function problem() {
            var param= $('#strVal').val();
            //breaking word using comma, pipe and semi-colon and turnng it into an array using the split
            params = param.split('|').join(',').split(':').join(',').split(',');
            //console.log(params);
            //removing the last element of the array
            // params.pop();
            //calling function to sum up all event of the array
            result = params.reduce(getSum, 0);
            function getSum(total, num) {
                return total + Math.round(num);
            }
            //end of array summing
            //console.log(result)
            $('#result').val(result);
        }
})


    
   
;