jQuery(document).ready(function($) {
  var username = "Ale46";
  var requri = 'https://api.github.com/users/' + username;
  var repouri = 'https://api.github.com/users/' + username + '/repos';

  $.getJSON(requri, function(json) {
    // else we have a user and we display their info
    var fullname = json.name;
    var username = json.login;
    var aviurl = json.avatar_url;
    var profileurl = json.html_url;
    var location = json.location;
    var followersnum = json.followers;
    var followingnum = json.following;
    var reposnum = json.public_repos;
    var avatar = json.avatar_url;

    if (fullname == undefined) {
      fullname = username;
    }
    if (avatar != undefined) {
      $('#img-avatar').html('<a href="#"><img src="' + avatar + '" class="center-block img-circle img-thumbnail img-responsive" alt="avatar"/></a>');
    }
    //$('#other-data').html('Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'');
    var social = '<ul class="socialf"><li> <a href="https://twitter.com/Ale467"> <i class="fa fa-twitter"> &nbsp; </i> </a> </li><li> <a href="https://github.com/Ale46"> <i class="fa fa-github"> &nbsp; </i> </a> </li><li> <a href="https://gratipay.com/~Ale46/"> <i class="fa fa-gittip"> &nbsp; </i> </a> </li></ul><br />';
    $('#name').html(fullname + social);
    $('#followers').html(followersnum);
    $('#following').html(followingnum);
    $('#repos').html(reposnum);

    var outhtml = "";
    var langs = [];
    var repositories;
    $.getJSON(repouri, function(json) {
      repositories = json;
      outputPageContent(window.location.pathname == '/');
    });

    function outputPageContent(home) {

      if (repositories.length == 0) {
        outhtml = outhtml + '<p>No repos!</p></div>';
      }else{
        $.each(repositories, function(index) {

          if (!repositories[index].description || repositories[index].fork)
            return;
          var lastupdate = new Date(repositories[index].updated_at);
          var html_url = "";
          langs[index] = repositories[index].language;
          //console.log(langs[index]);
          if (repositories[index].homepage === "" || repositories[index].homepage == undefined)
            html_url = repositories[index].html_url;
          else
            html_url = repositories[index].homepage;

          if (home){
            outhtml += '<li class="list-group-item col-xs-12 col-md-12 col-lg-6 col-sm-12">';
            outhtml += '<time datetime="' + lastupdate.getDate() + '/' + (lastupdate.getMonth() + 1) + '/' + lastupdate.getFullYear() + '">';
            outhtml += '<span class="lang"><i class="devicon-' + repositories[index].language.toLowerCase() + '-plain"></i></span>';
            outhtml += '<span class="textlang">' + repositories[index].language + '</span>';
            outhtml += '</time>';
            outhtml += '<div class="info">';
            outhtml += '<h2 class="title">' + repositories[index].name + '</h2>';
            outhtml += '<p class="desc">' + repositories[index].description + '</p>';
            outhtml += '<div class="pfoot">\
                                      <i class="fa fa-star"></i> ' + repositories[index].stargazers_count + '\
                                      <i class="fa fa-code-fork"></i> ' + repositories[index].forks_count + '\
                                  </div>';
            outhtml += '</div>';
            outhtml += '<div class="social">'
            outhtml += '<ul>';
            if (repositories[index].homepage)
              outhtml += '<li class=facebook style="width:33%;"><a href="' + repositories[index].homepage + '"><span class="fa fa-home"></span></a></li>';
            outhtml += '<li class=facebook style="width:33%;"><a href="' + repositories[index].html_url + '"><span class="fa fa-github"></span></a></li>';
            outhtml += '</ul></div></li>';
          }

        });
        others_html = "";
        if (home)
          $('.project-list').html(outhtml);
      }


      //TODO Leggere da json
      var others = [];
      $.ajaxSetup({
        async: false
      });

      $.getJSON("../../others.json", function(data) {

        $.each(data, function(index, value) {
          platform = "";
          if (home) {
            if ((index) % 3 == 0 && index > 1)
                others_html += "</div><div class=\"row stylish-panel\">";
            others_html += "\
            <div class=\"col-md-4\" style=\"padding-bottom:25px\";>\
              <div>\
                <img src=\"img/thumbs/" + this.id + "_thumb.png\" class=\"img-thumbnail\">\
                <h2>" + this.name + "</h2>";
            $.each(this.platform, function(index, value) {
              others_html += "<i class=\"fa fa-" + value + "\"></i> ";
            });
            others_html += "<p style=\"text-align: justify\">" + this.description + "</p>\
                    <a href=\"projects/" + this.id + "\" class=\"btn btn-primary\" title=\"See more\">See work »</a>\
                  </div>\
                </div>\
                ";

          }
          others.push(this.language);
        });

      });
      if (home) $('#otherworks').html("<div class=\"row stylish-panel\">" + others_html + "</div>");

      $.ajaxSetup({
        async: true
      });
      //
      //
      // var others = $('#otherworks').find('img').map(function() {
      //   return $(this).data('identif'); //.attr('title')
      // }).get();
      var n_other = 0;
      $.each(others, function(j) {
        n_other++;
        langs[langs.length] = others[j];
      });
      var total_language = langs.concat(others);
      var length = 0;
      var obj = total_language.reduce(function(acc, curr) {
        if (typeof acc[curr] == 'undefined') {
          acc[curr] = 1;
        } else {
          acc[curr] += 1;
        }
        length++;
        return acc;
      }, {});

      var staticshtml = "<h2><p>Statics: </p></h2>";
      var sort_array = [];
      for (var key in obj) {
        sort_array.push({
          key: key,
          value: obj[key]
        });
      }

      sort_array.sort(function(x, y) {
        return x.value - y.value
      });
      for (var i = 0; i < sort_array.length; i++) {
        var item = obj[sort_array[i].key];
      }
      //console.log(sort_array);
      for (var i = 0; i < sort_array.length; i++) {
        //100 :x = repositories.length : occurencies(langs[key])
        var percentage = 100 * sort_array[i]["value"] / (length);

        staticshtml += sort_array[i]["key"] + '<div class="progress">\
                      <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="' + percentage + '"\
                      aria-valuemin="0" aria-valuemax="100" style="width:' + percentage + '%">\
                        \
                      </div>\
                    </div>';
        //staticshtml += '<span class="label label-info tags">'+key+' ('+percentage.toFixed(2)+'%) </span>';
      }
      $('#skills').html(staticshtml);

    }
  }); // end requestJSON Ajax call
});
