
var CollisionSystem = function(){

  this.collision_objects = [];

  this.collision_array = new ArrayBuffer(1500);

  this.endpoint_view = new Uint16Array(this.collision_array);

  this.index_view = new Uint8Array(this.collision_array);
  
  this.next_array_index = 0;
  
  this.next_object_index = 0;

}

CollisionSystem.prototype = {

  checkCollisions: function(){
    
    this.sort();
    
    var collisions = [];
    //var collision = [];
    
    for(var i = 0; i < this.next_object_index; i = i + 3){
      
      var j = i + 5;
      
      while(this.index_view[i + 2] != this.index_view[j]){
        
        collisions.push([i, j]);
        
        j = j + 3;
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
    this.index_view[this.next_array_index + 1] = this.next_object_index;
    this.endpoint_view[this.next_array_index + 1] = right_endpoint;
    this.index_view[this.next_array_index + 2] = this.next_object_index;
    
    object.left_index = this.next_array_index;
    object.right_index = this.next_array_index + 1;
    object.collision_index = this.next_object_index;
    
    this.next_array_index = this.next_array_index + 2;
    this.next_object_index++;
    
  },
  
  remove: function(array_index){
    
    this.endpoint_view[this.collision_objects[array_index].left_index] = null;
    this.index_view[this.collision_objects[array_index].left_index + 2] = null;
    this.endpoint_view[this.collision_objects[array_index].right_index] = null;
    this.index_view[this.collision_objects[array_index].right_index + 2] = null;
    
    this.collision_objects.splice(array_index, 1);
    
  },
  
  sort: function(){
    
    var swapped = true;
    
    while(swapped){

      swapped = false;

      for(var i = 0; i < this.next_object_index; i = i + 3){
        
        if(this.endpoint_view[i] < this.endpoint_view[i + 3]){
          swapped = true;
          
          var temp = this.endpoint_view[i];
          this.endpoint_view[i] = this.endpoint_view[i + 3];
          this.endpoint_view[i + 3] = temp;
          
          temp = this.index_view[i + 2];
          this.index_view[i + 2] = this.index_view[i + 5];
          this.index_view[i + 5] = temp;
          
        }
      }
    }
  }

}