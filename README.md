# CodImg
Generate Beautiful images of your code!

## Example:
![](https://codimg.xyz/api/image?hideButtons=false&lineNumbers=true&language=javascript&theme=hopscotch&show-background=true&gistId=f1cd4a02f0171118171fbaae7f3a2202)

`![](https://codimg.xyz/api/image?hideButtons=false&lineNumbers=true&language=javascript&theme=hopscotch&show-background=true&gistId=f1cd4a02f0171118171fbaae7f3a2202)` - the query for above image

## API Documentation

The API supports the following 4 operations

* [Get Image](#get-image)
* [List Themes](#list-themes)
* [List Languages](#list-languages)
* [List Fonts](#list-fonts)

### Get Image

- HTTP Method: `POST`/`GET`
- Endpoint: `/api/to-image`
- Content-Type: `text/plain`
- Response Content Type: `image/png`

**Query Parameters**

|    Parameter    |  Type   | Required |                                             Description                                              |                     Possible Values                     |             Example              |
|:---------------:|:-------:|:--------:|:----------------------------------------------------------------------------------------------------:|:-------------------------------------------------------:|:--------------------------------:|
|      code       | string  |   true   |                           Sets the code. Not needed if gistId is provided.                           |                       Any string                        |       ``` var a = 69; ```        |
|     gistId      | string  |  false   |                                           Gist ID of code.                                           |                      Valid Gist ID                      | e6cdcb6198546f324adca0995b191649 |
|      theme      | string  |   true   |                                        Sets the prismjs theme                                        |  get the /api/themes endpoint for all possible values   |            a11y-dark             |
|    language     | string  |   true   |                                    Sets the programming language                                     | get the /api/languages endpoint for all possible values |            javascript            |
|   lineNumbers   | boolean |  false   |                                  Shows the line numbers on the side                                  |                       true/false                        |               true               |
|   scaleFactor   | integer |  false   |                                 Controls the scale/size of the image                                 |                           1-5                           |                2                 |
|      width      | integer |  false   |                                     Sets the width of the image                                      |                   any value in pixels                   |               500                |
| backgroundColor | string  |  false   |                                Sets the background color of the image                                |                     valid CSS color                     |              green               |
| backgroundImage | string  |  false   |                                Sets the background Image of the image                                |                   valid URL to image                    | https://picsum.photos/1920/1080  |
| showBackground  | boolean |  false   |                             Controls whether to show or hide background                              |                       true/false                        |               true               |
|   hideButtons   | boolean |  false   |                               Controls whether to show or hide buttons                               |                       true/false                        |               true               |
|     padding     | integer |  false   | controls the size of padding around the image. setting to 0 is like setting showBackground to false. |                          0-10                           |                5                 |

**Description:** Given a code snippet in the request body, an image will be returned with the specified theme and language options.

### List Themes
- HTTP Method: `GET`
- Endpoint: `/api/themes`
- Response Content Type: `application/json`

**Description:** Get a list of all supported themes.

### List Languages
- HTTP Method: `GET`
- Endpoint: `/api/languages`
- Response Content Type: `application/json`

**Description:** Get a list of all supported languages.

### List Fonts
- HTTP Method: `GET`
- Endpoint: `/api/fonts`
- Response Content Type: `application/json`

 **Description:** Get a list of all supported fonts.
