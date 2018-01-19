$('document').ready(() => {

    $('.hidden').hide();

    let requestBody = { places : []};
    let order = 1;

        $('.js-getData').click((e) => {
            e.preventDefault();
            $('.js-getData').blur();
            $('.repres').html('');
            let form = $('#weather').serialize();

            $.get(`/api/weather?${form}`, (data) => {

                console.log(data);

                let weatherData = data;
                console.log(weatherData);

                showWeatherAt(weatherData);
                
               
            })
        });

        $('.js-add').click((e) => {
            e.preventDefault();
            $('.js-add').blur();
            var place = {
                city: $('[name=city]').val(),
                country: $('[name=country]').val()
            }
            console.log(place);

            let listItem = document.createElement('tr');
                listItem.setAttribute('class', 'list-item');
            
                listItem.innerHTML = `<th>${order}</th>
                                      <td>${place.city}</td>
                                      <td>${place.country}</td>`; 
                
            console.log(requestBody.places);
  
            let includes = requestBody.places.findIndex((index) => {
                return _.isEqual(index, place);
        
            })

            let consist = Object.values(place).every((index) => {
                return !!index;
            })

            console.log(Object.values(place));
            console.log(includes);
            console.log(consist);
            console.log(requestBody.places);

            if( (consist === true) && includes == -1 ) {
                $('.hidden').show();
                console.log(includes);
                requestBody.places.push(place);
                console.log('push!');
                $('.city-list').append(listItem);
                order++;
            } 
            else if (includes != -1) {
                alert('Already exist !');
                console.log('already exist');
            }
        
        }) 

        $('.js-fetch').click((e) => {
            e.preventDefault();
            $('.js-fetch').blur();
            console.log(requestBody);
            console.log('Sent');
            $('.repres').html('');

            $.ajax({
                method: 'POST',
                url: '/api/weather',
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                data: requestBody,
                dataType: 'json',
                success: (res) => {
                  
                    console.log(res);
                    let data = res.weatherAt;
                    
                    console.log(data);
                    data.forEach((index) => {
                        showWeatherAt(index)
                    })
                },
                error: (err) => {
                    console.error(err.status, err.message);
                }
            })
        })


    function showWeatherAt(item) {

        let weatherTemplate = $('.weather-template').html();
        let model = _.pick(item, ['coord',
                                    'main.temp',
                                    'wind.speed',
                                    'name',
                                    'sys.country',
                                    'sys.sunrise',
                                    'sys.sunset',
                                    'weather[0].main',
                                    'weather[0].description' ]);
        console.log(model);
        console.log(weatherTemplate);

        let html = _.template(weatherTemplate)(model);
        let weatherAt = document.createElement('div');
            weatherAt.setAttribute('class', 'weather-at col-sm-4');
            weatherAt.innerHTML = html;
            console.log(weatherAt,"message");
        $('.repres').append(weatherAt);
        $('.weather-at').addClass('alert alert-info');
    }
})