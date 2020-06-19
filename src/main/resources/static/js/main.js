
$(function () {
  let currentUserId = $('#authUserId').val();


  $.ajax({
    type: 'GET',
    contentType: "application/json",
    url: '/user/'+currentUserId,
    success: function (user) {
      addInfo(user);
      addRow('table-info', user);
      if (isUserAdmin(user)) {
        getAllUsers();
        showElementsForAdmin();
      };
    },
    error: function () {
      alert('Error loading user '+currentUserId)
    }
  });

  $('#btn_new_user').on('click', function () {
    let userRoles=[];
    $('#selectRole option').each(function(){
      if (this.selected) {
        userRoles.push({
          id: this.value,
          name: this.text
        });
      }
    });
    let user={
      firstName: $('#firstName').val(),
      lastName: $('#lastName').val(),
      email: $('#email').val(),
      password: $('#password').val(),
      roles: userRoles
    };

    $.ajax({
      type: 'POST',
      contentType: "application/json",
      url: '/admin/',
      data: JSON.stringify(user),
      dataType: 'json',
      success: function (newUser) {
          addRow('table-users', newUser);
      },
      error: function () {
        alert('Error adding new user')
      }
    });

  });

  $('#deleteModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget);
    let userId = button.data('target-id');
    let modal = $(this)

    $.ajax({
      type: 'GET',
      contentType: "application/json",
      url: '/user/'+userId,
      success: function (user) {
        modal.find('.modal-body #idDelete').val(user.id);
        modal.find('.modal-body #firstNameDelete').val(user.firstName);
        modal.find('.modal-body #lastNameDelete').val(user.lastName);
        modal.find('.modal-body #emailDelete').val(user.email)
        $.each(user.roles, function (i, role) {
          $('#rolesDelete').find('option[value='+role.id+']').attr("selected","selected");
        });
      },
      error: function () {
        alert('Error loading user')
      }
    });
  });

  $('#submitModalDelete').on('click', function() {
    let userId = $('.modal-body #idDelete').val();

    $.ajax({
      type: 'DELETE',
      contentType: "application/json",
      url: '/admin/'+userId,
      success: function () {
        let row = document.getElementById("row"+userId);
        row.remove();
        $('#deleteModal').modal('hide');
      },
      error: function () {
        alert('Error deleting user')
      }
    });
  });

  $('#editModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget);
    let userId = button.data('target-id');
    let modal = $(this)

    $.ajax({
      type: 'GET',
      contentType: "application/json",
      url: '/user/'+userId,
      success: function (user) {
        modal.find('.modal-body #idEdit').val(user.id);
        modal.find('.modal-body #firstNameEdit').val(user.firstName);
        modal.find('.modal-body #lastNameEdit').val(user.lastName);
        modal.find('.modal-body #emailEdit').val(user.email);
        modal.find('.modal-body #passwordEdit').val(user.password);

        $.each(user.roles, function (i, role) {
          // alert($('#rolesEdit').find('option[value='+role.id+']').selected = true)
          $('#rolesEdit').find('option[value='+role.id+']').attr("selected", "selected");
        });

        // modal.find("select[name='#rolesEdit'] option[value='"+user.roles.id+ "']").selected = true;

      },
      error: function () {
        alert('Error loading user')
      }
    });
  });

  $('#submitModalEdit').on('click', function() {
    let userId = $('.modal-body #idEdit').val();
    let userRoles=[];
    $('#rolesEdit option').each(function(){
      if (this.selected) {
        userRoles.push({
          id: this.value,
          name: this.text
        });
      }
    });
    let user={
      id: $('.modal-body #idEdit').val(),
      firstName: $('.modal-body #firstNameEdit').val(),
      lastName: $('.modal-body #lastNameEdit').val(),
      email: $('.modal-body #emailEdit').val(),
      password: $('.modal-body #passwordEdit').val(),
      roles: userRoles
    };

    $.ajax({
      type: 'PUT',
      contentType: "application/json",
      url: '/admin/',
      data: JSON.stringify(user),
      dataType: 'json',
      success: function (newUser) {
        let row = document.getElementById("row"+userId);
        row.remove();
        addRow('table-users', newUser);
        $('#editModal').modal('hide');
      },
      error: function () {
        alert('Error editing user')
      }
    });
  });

});

function showElementsForAdmin() {
  let panel=document.getElementById('adminPanelLi');
  panel.hidden=false;
  panel.show()
}

function isUserAdmin(user) {
  let isAdmin=false;
  $.each(user.roles, function (i, role) {
    if(role.name=="ADMIN") {
      isAdmin=true;
    }
  });
  return isAdmin;
}

function getAllUsers() {
  $.ajax({
    type: 'GET',
    contentType: "application/json",
    url: '/admin/',
    success: function (users) {
      $.each(users, function (i, user) {
        addRow('table-users', user);
      });
    },
    error: function () {
      alert('Error loading users')
    }
  });
}

function addRow(table, user) {
  let d = document;
  // Находим нужную таблицу
  let tbody = d.getElementById(table).getElementsByTagName('TBODY')[0];

  // Создаем строку таблицы и добавляем ее
  let row = d.createElement("TR");
  if (table=='table-info') {
    row.id = "rowI" + user.id;
  } else {
    row.id="row"+user.id;
  }
  tbody.appendChild(row);
  // Создаем ячейки в вышесозданной строке и добавляем их
  let td_id = d.createElement("TD");
  let td_firstname = d.createElement("TD");
  let td_lastname = d.createElement("TD");
  let td_email = d.createElement("TD");
  let td_roles = d.createElement("TD");
  row.appendChild(td_id);
  row.appendChild(td_firstname);
  row.appendChild(td_lastname);
  row.appendChild(td_email);
  row.appendChild(td_roles);

  // Наполняем ячейки
  td_id.innerHTML = user.id;
  td_firstname.innerHTML = user.firstName;
  td_lastname.innerHTML = user.lastName;
  td_email.innerHTML = user.email;
  td_roles.innerHTML = convertArrayIntoString(user.roles);

  if (table=='table-users') {
    let td_btn_edit = d.createElement("TD");
    let td_btn_delete = d.createElement("TD");
    row.appendChild(td_btn_edit);
    row.appendChild(td_btn_delete);
    td_btn_edit.appendChild(addButton("btn btn-info btn-primary", user.id, "Edit"));
    td_btn_delete.appendChild(addButton("btn btn-danger btn-primary", user.id, "Delete"));
  }

}

function addInfo(user) {
  let info = document.getElementById('userInfo');
  info.innerHTML='<b>'+user.email+'</b>' + " with roles: " +convertArrayIntoString(user.roles);
}

function convertArrayIntoString(array) {
  let result="";
  for (let i = 0; i < array.length; i++) {
    result+=array[i].name + ", ";
  }
  if (result.length == 0) {
    return result;
  }
  return result.substr(0, result.length-2);
}

function addButton(classType, userId, btnAction) {
  let btn = document.createElement("button");
  btn.type="button";
  btn.value=btnAction;
  btn.className=classType;
  btn.setAttribute("data-toggle", "modal");
  btn.setAttribute("data-target-id", userId);
  if (btnAction=="Delete") {
    btn.setAttribute("data-target", "#deleteModal");
  } else {
    btn.setAttribute("data-target", "#editModal");
  }
  btn.innerHTML=btnAction;
  return btn;
}
