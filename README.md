# Capstone_Project
App Idea: An app where you can keep track/build a map of the hikes you’ve done and share with friends

Core Features
- [x] The Home page shows about section, contact information, etc.
- [x] On the Find Hikes page, a user can search for a hike by name, and when they click the search/submit button, all the hikes with a matching name will show up on the left sidebar along with a map that has markers corresponding to the hikes in the left sidebar. 
- [x] On the Find Hikes page, a user can click on and expand any of the hikes in the left sidebar. When they do so, the map should only have the marker corresponding to that hike, and the left sidebar should show more details about the hike, such as length, difficulty, etc. There should also be an interesting cursor interaction so that users can scroll through the top photos posted by users for that hike. This will require some kind of filtering algorithm.
- [x] On the Find Hikes page, there’s a saved and completed button in the top right corner of each hike in the left sidebar so that users can save hikes for later or mark them as completed. Then, users can filter the hikes in the left sidebar for their saved or completed hikes.
- [x] On the Feed page, users can make a post of their hikes where they can add the trail name, a photo, and a description/caption.
- [x] On the Feed page, users can see all the posts from their friends. They should also be able to like other people’s posts, and when they click on the title/trail on a post, it should take them to the Find Hikes page where they can see details and the marker for that hike.
- [x] If a user is not logged in to their account, they cannot access the Feed page
- [x] Users can create an account and sign in/out. When they view their own profile, they have the option to see all of their posts, see how many friends they have, view stats about how many hikes, how far they went, etc. over the past month, and edit their profile picture and background picture.
- [x] Users can view other users’ profiles. When they do so, they should see other users’ posts and friends. They should be able to add other users as friends, in which a friend request will be sent to the other user.


Stretch Features
- [x] On the Find Hikes page, users can filter hikes to find hikes that are within a 50 mile radius of them - I used the GeoLocation API to access a user’s location
- [x] On the Find Hikes page, users can leave comments/reviews on hikes.
- [x] Users can create hikes if they are not already on the map
- [x] Live Feed: I learned about WebSockets and how to use Socket.IO. For logged in users, I connect the client to the server. Whenever a user posts, their respective client emits an event to the server. The server then broadcasts an event to all clients connected to the server. If any logged in user is a friend of the user who posted, their feed will then receive that event, which indicates that they should fetch the new post data and refresh.
- [x] End to end automated testing - I created a dummy admin account, and wrote tests in Cypress that log in this user, test out the Feed page, look up hikes in the Find Hikes page, etc. Then, I wrote a testing script and used Github actions to install my app’s dependencies and run this testing script every time someone makes a push or pull request.
- [x] When adding features to my webpage, it’s likely that some of my core features may break. Thus, I implemented End-to-End testing for my application—I have those tests automatically run whenever a pull or push request is made.
- [x] Build unique custom animations - I animated a picture of a figure running that displays on the loading page as well as animated my logo to make it a sun rising above mountains


Complexity/Problems
1. I couldn’t find an API that suited my needs well, so I combined data from a few databases to make my own data model
I looked at a handful of APIs, including this one and this one. However, I found when I was testing them that neither of them fit my needs very well and decided it would be better to make my own API that I can fetch hikes from. I found an open source project on Github today that contains a Ruby file that has information on over 1,000 hikes. I reformatted and converted it into a JSON file as well as took some of the data from the APIs mentioned above, imported it into my backend, and created my own endpoints so that I can fetch data from them
2. When loading my app, I noticed that it took a little while to fetch and load a user’s feed page which contains posts from their friends. If my app were to have the same amount of users as a platform like Facebook and a user had a lot of friends, it would take a very long time for the feed page to load. Also, it was only sorted with the most recent posts at the top which I had implemented using a built in Parse method. Using the Fan Out on Write method, I implemented a quick algorithm that uses a priority queue and the geolocation API that calculates the distance between the location of the user and a hike and gives higher priority to posts that are about hikes closer to a user’s location. I also used prefetching and caching. With all of this, users’ feed pages are ready to view as soon as they navigate there.

User Roles:
- Hiker: a user who is seeking to track and share their hikes with friends

User Stories:
- As a hiker, I want to create a profile so that I can connect with other hikers
- As a hiker, I want to be able to share my hikes with friends
- As a hiker, I want to be able to see a feed with hikes that my friends have done recently
- As a hiker, I want to be able to find and look up hikes
- As a hiker, I want to add hikes that I’ve done on the map so that I can keep track of the hikes I’ve done
- As a hiker, I want to be able to see weekly stats so that I can see the progress I have made
- As a hiker, I want to be able to look up hikes by name
- As a hiker, I want to be able to save hikes for later
- As a hiker, I want to be able to mark hikes as complete
- As a hiker, I want to be able to click on other people’s profile and see their posts
- As a hiker, I want to be able to like other people's posts

Pages/Screens with Wireframes on Figma:
- https://www.figma.com/file/nudqCgRgjuNkWFyO5MN76k/Capstone-Project-Screens?node-id=5%3A60
- Home Page
- Find Hikes Page
- Feed Page
- View Profile Page
- Login Page

Requirements:

<img width="497" alt="Screen Shot 2022-08-01 at 10 35 28 AM" src="https://user-images.githubusercontent.com/86620096/182208812-64a8e9aa-0853-4143-9184-b3de9fb3867d.png">

Diagram of Data Model:
- <img width="645" alt="Screen Shot 2022-06-29 at 3 35 40 PM" src="https://user-images.githubusercontent.com/86620096/176557214-1c7bea84-c16b-4855-9f80-b68406021824.png">

- <img width="640" alt="Screen Shot 2022-06-29 at 3 35 57 PM" src="https://user-images.githubusercontent.com/86620096/176557237-bbf7f8b3-546b-47cf-8662-5a3b00758e44.png">


Endpoints:
- <img width="635" alt="Screen Shot 2022-06-29 at 3 36 23 PM" src="https://user-images.githubusercontent.com/86620096/176557279-57d632d2-6f1f-4fbb-987a-8527182aac1a.png">

Project Plan:
- <img width="638" alt="Screen Shot 2022-07-11 at 8 59 28 AM" src="https://user-images.githubusercontent.com/86620096/178306998-0505cd59-a1bb-4560-a874-0920bdae031e.png">

- <img width="653" alt="Screen Shot 2022-07-11 at 8 59 32 AM" src="https://user-images.githubusercontent.com/86620096/178307054-e6857aa5-64c9-4696-9bca-b0c63db2d032.png">


