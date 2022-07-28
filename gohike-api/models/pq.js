/**
 * @fileoverview This file implements methods for a priority queue elements to
 * insert user's posts for their feed with high priority given to posts about
 * hikes close to the user.
 */

/**
 * This class handles the creating priority queue elements and inserting into a
 * priority queue.
 */
class pq {
  constructor() {
    this.super();
  }

  /**
   * 
   * @param {Array<{ id: string, lat: number, lng: number, priority: 
   * number }>} arr Post id's for a user's feed in unsorted order
   * @param {*} userLat Latitude of current user
   * @param {*} userLng Longitude of current user
   * @returns 
   */
  static create(arr, userLat, userLng) {
    let pq = []
    for (let i = 0; i < arr.length; i++) {
      pq = this.insert(pq, arr[i].id, arr[i].lat, arr[i].lng, userLat, userLng)
    }

    return pq
  }

  /**
   * Converts a number in degrees to radians
   *
   * @param {number} deg
   * @returns {number} Result in radians
   */
  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Gets distance in kilometers between two points given by their lat and lng
   *
   * @param {number} lat1 Latitude of first point
   * @param {number} lon1 Longitude of first point
   * @param {number} lat2 Latitude of second point
   * @param {number} lon2 Longitude of second point
   * @returns {number} Distance in kilometers
   */
  static getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    // Radius of the earth in km
    var R = 6371;
    // deg2rad below
    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Distance in km
    var d = R * c;
    return d;
  }

  /**
   * Get the index of the parent of a child node
   *
   * @param {number} index Index of child node
   * @returns {number} Index of parent node
   */
  static parentIndex(index) {
    return parseInt((index - 1) / 2);
  }

  /**
   * Shifts node up to maintain heap property of priority queue
   *
   * @param {Array<{ id: string, lat: number, lng: number, priority: 
   * number }>} arr Priority queue to insert into
   * @param {number} index Index of current node
   * @returns {Array<{ id: string, lat: number, lng: number, priority: 
   * number }>} Priority queue with newly inserted post
   */
  static shiftUp(arr, index) {
    while (
      index >= 0 &&
      arr[this.parentIndex(index)].priority < arr[index].priority
    ) {
      // Swap parent and current node
      var temp = arr[index];
      arr[index] = arr[this.parentIndex(index)];
      arr[this.parentIndex(index)] = temp;

      // Update index to parent of index
      index = this.parentIndex(index);
    }

    return arr;
  }

  /**
   *
   * @param {Array<{ id: string, lat: number, lng: number, priority: 
   * number }>} arr Priority queue
   * containing post id's from friends of the user
   * @param {string} postId Of the post to insert
   * @param {number} postLat Latitude of the hike the post to insert is about
   * @param {number} postLng Longitude of the hike the post to insert is about
   * @param {number} userLat Latitude of the user of which the pq we are
   * inserting into is from
   * @param {number} userLng Longitude of the user of which the pq we are
   * inserting into is from
   * @returns {Array<{ id: string, lat: number, lng: number, priority: 
   * number }>} Priority queue with newly inserted post
   */
  static insert(arr, postId, postLat, postLng, userLat, userLng) {
    // let posts about hikes closest to the user have higher priority
    let priority = -1 * this.getDistanceFromLatLonInKm(
      postLat,
      postLng,
      userLat,
      userLng
    );

    // Insert post at the end and shift up accordingly
    arr.push({ id: postId, priority, lat: postLat, lng: postLng });
    let insertedPq = this.shiftUp(arr, arr.length - 1);

    // Return new pq
    return insertedPq;
  }
}

export {pq}