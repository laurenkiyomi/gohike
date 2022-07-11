# Capstone_Project
App Idea: An app where you can keep track/build a map of the hikes you’ve done and share with friends

Core Features
1. The Home page shows about section, contact information, etc.
2. On the Find Hikes page, a user can search for a hike by name, and when they click the search/submit button, all the hikes with a matching name will show up on the left sidebar along with a map that has markers corresponding to the hikes in the left sidebar. They can also filter hikes in the left sidebar by saved and completed hikes.
3. On the Find Hikes page, a user can click on and expand any of the hikes in the left sidebar. When they do so, the map should only have the marker corresponding to that hike, and the left sidebar should show more details about the hike, such as length, difficulty, etc. There should also be an interesting cursor interaction so that users can scroll through the top photos posted by users for that hike. This will require some kind of filtering algorithm.
4. On the Find Hikes page, there’s a saved and completed button in the top right corner of each hike in the left sidebar so that users can save hikes for later or mark them as completed. Then, users can filter the hikes in the left sidebar for their saved or completed hikes.
5. On the Feed page, users can make a post of their hikes where they can add the trail name, a photo, and a description/caption.
6. On the Feed page, users can see all the posts from their friends. They should also be able to like other people’s posts, and when they click on the title/trail on a post, it should take them to the Find Hikes page where they can see details and the marker for that hike.
7. On the Feed page, if a user is not logged in to their account, it will just show all the posts from all users.
8. Users can create an account and sign in/out. When they view their own profile, they have the option to see all of their posts, see their friends, view stats about how many hikes, how far they went, etc. over the past month, and edit their profile picture and background picture.
9. Users can view other users’ profiles. When they do so, they should see other users’ posts and friends. They should be able to add other users as friends, in which a friend request will be sent to the other user.

Stretch Features
1. On the Find Hikes page, users can filter hikes to find hikes near them (within a certain radius of their location)
2. On the Find Hikes page, when the user clicks on a hike on the left sidebar, in addition to the map showing only a marker at the trailhead of that specific hike, a red line will appear on the map that marks the trail/path of the hike.
3. On the Find Hikes page, users can rate and leave comments/reviews on hikes.
4. On the Feed page, posts are sorted by most liked.

Complexity/Planned Problems
1. I haven’t found an API that has all the data that I need. The Google Maps API doesn’t have the stats (length, difficulty, etc) for hikes, but I would like to use it to place markers on the map. On the other hand, the Hiker API returns stats for hikes but doesn’t have any endpoints other than all hikes. It also doesn’t return the longitude and latitude for hikes, but the Google Maps API returns a map with markers when given longitude and latitude. I need to find a way to combine these APIs or similar APIs to get all of the information I need.
2. On the Find Hikes page, when a user clicks on a specific hike, I need to create some sort of filtering algorithm that queries the database to find all pictures from only that hike and then filters those pictures to only show the top ten most liked pictures for that hike. I want the way the pictures are displayed to involve some sort of unique animation and cursor interaction component.

User Roles:
- Hiker: a user who is seeking to track and share their hikes with friends

User Stories:
- As a hiker, I want to create a profile so that I can connect with other hikers
- As a hiker, I want to be able to share my hikes with friends
- As a hiker, I want to be able to see a feed with hikes that my friends have done recently
- As a hiker, I want to be able to find and look up hikes
- As a hiker, I want to add hikes that I’ve done on the map so that I can keep track of the hikes I’ve done
- As a hiker, I want to be able to see weekly stats so that I can see the progress I have made
- As a hiker, I want to be able to participate in challenges so that I am motivated to hike more
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

Diagram of Data Model:
- <img width="645" alt="Screen Shot 2022-06-29 at 3 35 40 PM" src="https://user-images.githubusercontent.com/86620096/176557214-1c7bea84-c16b-4855-9f80-b68406021824.png">

- <img width="640" alt="Screen Shot 2022-06-29 at 3 35 57 PM" src="https://user-images.githubusercontent.com/86620096/176557237-bbf7f8b3-546b-47cf-8662-5a3b00758e44.png">


List of Endpoints:
- <img width="635" alt="Screen Shot 2022-06-29 at 3 36 23 PM" src="https://user-images.githubusercontent.com/86620096/176557279-57d632d2-6f1f-4fbb-987a-8527182aac1a.png">

Project Plan:
- <img width="638" alt="Screen Shot 2022-07-11 at 8 59 28 AM" src="https://user-images.githubusercontent.com/86620096/178306998-0505cd59-a1bb-4560-a874-0920bdae031e.png">

- <img width="653" alt="Screen Shot 2022-07-11 at 8 59 32 AM" src="https://user-images.githubusercontent.com/86620096/178307054-e6857aa5-64c9-4696-9bca-b0c63db2d032.png">


