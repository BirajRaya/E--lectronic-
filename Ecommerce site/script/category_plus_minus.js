window.onload = function(){
    var mainCategory = document.getElementsByClassName('main-category');
    var subCategory = document.getElementsByClassName('sub-category-tabs');
    var tabs1 = document.getElementsByClassName('tabs1')[0]; // get the tabs1 element
tabs1.style.display = 'block'; // set tabs1 to be visible on page load
    for(var i=0; i<mainCategory.length; i++){
        mainCategory[i].addEventListener('click', function(){
            var subCategory = this.nextElementSibling;
            if(subCategory.style.display == 'block'){
                subCategory.style.display = 'none';
                this.children[0].classList.remove('fa-minus');
                this.children[0].classList.add('fa-plus');
            }else{
                subCategory.style.display = 'block';
                this.children[0].classList.remove('fa-plus');
                this.children[0].classList.add('fa-minus');
            }
        });
      } 
    }