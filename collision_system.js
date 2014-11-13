
var CollisionSystem = function(){

  this.collision_objects = [];

  this.collision_array = new ArrayBuffer(1500);

  this.endpoint_view = new Uint16Array(this.collision_array);

  this.index_view = new Uint16Array(this.collision_array, 2);
  
  this.next_array_index = 0;
  
  this.next_object_index = 0;

}

CollisionSystem.prototype = {

  checkCollisions: function(){
    
    this.sort();
    
    var collisions = [];
    //var collision = [];
    
    for(var i = 0; i + 2 < this.next_object_index * 4; i = i + 2){
      
      var j = i + 2;
      
      while(this.index_view[i] != this.index_view[j] && this.collision_objects[this.index_view[i]].left_index == i){
        
        if(!this.hasElement(collisions, [this.collision_objects[this.index_view[j]], this.collision_objects[this.index_view[i]]]))
          collisions.push([this.collision_objects[this.index_view[i]], this.collision_objects[this.index_view[j]]]);
        
        j = j + 2;

        if(j >= this.next_object_index * 4)
          break;
      }
    }
    
    return collisions;
    
  },

  update: function(array_index, left_endpoint, right_endpoint){
  
    this.endpoint_view[this.collision_objects[array_index].left_index] = left_endpoint;
    this.endpoint_view[this.collision_objects[array_index].right_index] = right_endpoint;
  },
  
  add: function(object, left_endpoint, right_endpoint){
    
    this.collision_objects.push(object);
    
    this.endpoint_view[this.next_array_index] = left_endpoint;
    this.index_view[this.next_array_index] = this.next_object_index;
    this.endpoint_view[this.next_array_index + 2] = right_endpoint;
    this.index_view[this.next_array_index + 2] = this.next_object_index;
    
    object.left_index = this.next_array_index;
    object.right_index = this.next_array_index + 2;
    object.collision_index = this.next_object_index;
    
    this.next_array_index = this.next_array_index + 4;
    this.next_object_index++;
    
  },
  
  remove: function(array_index){
    
    this.endpoint_view[this.collision_objects[array_index].left_index] = 9999;
    this.index_view[this.collision_objects[array_index].left_index] = 9999;
    this.endpoint_view[this.collision_objects[array_index].right_index] = 9999;
    this.index_view[this.collision_objects[array_index].right_index] = 9999;
    
    this.collision_objects.splice(array_index, 1);
    
    this.sort();
    
    this.next_object_index--;
    this.next_array_index = this.next_array_index - 4;
    
  },
  
  sort: function(){
    
    var swapped = true;
    
    while(swapped){

      swapped = false;

      for(var i = 0; i + 2 < this.next_object_index * 4; i = i + 2){

        if(this.endpoint_view[i] > this.endpoint_view[i + 2]){
          swapped = true;
          
          if(this.index_view[i] != 9999){
            if(this.endpoint_view[this.collision_objects[this.index_view[i]].left_index] == this.endpoint_view[i]){
              this.collision_objects[this.index_view[i]].left_index = i + 2;
            }
            else{
              this.collision_objects[this.index_view[i]].right_index = i + 2;
            }
          }
          
          if(this.index_view[i+2] != 9999){
            if(this.endpoint_view[this.collision_objects[this.index_view[i + 2]].left_index] == this.endpoint_view[i + 2]){
              this.collision_objects[this.index_view[i + 2]].left_index = i;
            }
            else{
              this.collision_objects[this.index_view[i + 2]].right_index = i;
            }
          }
          
          var temp = this.endpoint_view[i];
          this.endpoint_view[i] = this.endpoint_view[i + 2];
          this.endpoint_view[i + 2] = temp;
          
          temp = this.index_view[i];
          this.index_view[i] = this.index_view[i + 2];
          this.index_view[i + 2] = temp;
        }
      }
    }
  },
  
  hasElement: function (array, element) {
    
    for (var i = 0; i < array.length; i++) {
      
        if (array[i][0] == element[0] && array[i][1] == element[1]) {
            return true;
        }
    }
    return false;
  }

}