import XMLHttpRequest from 'xhr2';

export default {
    getUser: function(userId){
        let ajax = new XMLHttpRequest();
         ajax.open("GET", `./database/getUser.php?userId=${userId}`, true)

         ajax.send();
        
        ajax.onreadystatechange = function(){
            if(this.readyState = 4 && this.status === 200){
                console.log(response);
                return this.response;
            }
        }
    },
    createNewUser: function(userId, date){
        let ajax = new XMLHttpRequest();
        ajax.open("SET", `./database/createUser?userId=${userId}&date=${date}`, true);

        ajax.send();
        
        ajax.onreadystatechange = function(){
            if(this.readyState = 4 && this.status === 200){
                return "success"
            }
        }
    },
    setUserData: function(userId, date){
        let ajax = new XMLHttpRequest();
        ajax.open("SET", `./database/setUserData?userId=${userId}&date=${date}`, true);

        ajax.send();
        
        ajax.onreadystatechange = function(){
            if(this.readyState = 4 && this.status === 200){
                return "success"
            }
        }
    }
}