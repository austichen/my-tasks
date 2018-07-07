document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);
  $(".dropdown-trigger").dropdown();
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

  $('.mark-done-link').on('click', function(e) {
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'GET',
      url: '/task/edit/'+id+'?done=true',
      success: response => {
        alert('done!');
        window.location.href="/";
      },
      error: err => {
        alert('Error marking task as read');
        window.location.herf="/";
      }
    })
  })
});
