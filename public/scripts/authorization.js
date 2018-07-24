document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
  $(".dropdown-trigger").dropdown();
  $('.datepicker').datepicker({format: 'yyyy-mm-dd'});
  $('#alert_close').click(function(){
      $( "#alert_box" ).fadeOut( "slow", function() {
      });
    });

  $('.icon-card').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    console.log('id: ',id)
    $.ajax({
      type: 'DELETE',
      url: '/task/delete/'+id,
      success: response => {
        alert('Task successfuly deleted');
        window.location.href='/';
      },
      error: err => {
        alert('Error deleting task');
        window.location.href='/';
      }
    })
  })
  //asdfsadf
  /*
  $('.mark-done-link').on('click', function(e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    const done= $target.attr('data-done');

    $.ajax({
      type: 'GET',
      url: `/task/edit/${id}?done=${done}`,
      success: response => {
        alert('done!');
        window.location.href="/";
      },
      error: err => {
        alert('Error marking task as ',text);
        window.location.herf="/";
      }
    })
  })
  */
  //asdfadsf
  $('.mark-done-link').on('click', function(e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    //TODO: done is null, find out why
    const done= $target.attr('data-done');
    console.log('done: ',done, 'type: ', typeof done);
    const text = done ? 'uncompleted' : 'completed';
    console.log('text: ',text)
    $.ajax({
      type: 'GET',
      url: `/task/edit/${id}?done=${done}`,
      success: response => {
        window.location.reload();
      },
      error: err => {
        alert('Error marking task as ',text);
        window.location.reload();
      }
    })
  })
  $('#search-button').on('click', function(e) {
    const searchQuery = $('#search_input').val();
    console.log(searchQuery)
    if(searchQuery=="") {
      window.location.replace('/task');
    } else {
      window.location.replace(`/task?search=${searchQuery}`)
    }
  })

  //Render Chart
  if($('.chartContainer').length) {
    const tasksChart = $('#myChart');
    Chart.defaults.global.defaultFontFamily = 'Roboto'
    Chart.defaults.global.defaultFontSize = 14
    const chart = new Chart(tasksChart, {
      type: 'pie',
      data: {
        labels: ['Completed', 'Uncompleted'],
        datasets:[{
          data: taskData,
          backgroundColor: [
            '#00c853',
            '#ff5252'
          ]
        }]
      }
    })
  }

});
