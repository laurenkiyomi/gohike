/**
 * @fileoverview This file tests the core features of the GoHike app API.
 */
/// <reference types="cypress" />

describe("Login", function () {
  it("Navigate to login", function () {
    // Navigate to login page
    cy.visit("https://fascinating-muffin-dd8390.netlify.app/");
    cy.get(".login-button").contains("Log In").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login");
    });
  });

  it("Enter username and password", function () {
    // Enter user info
    cy.get(".username-input").type("admin123");
    cy.get(".password-input").type("admin123");

    // Login and check for login user info in local storage
    cy.get(".login-page-button")
      .click()
      .then((res) => {
        cy.wait(10000)
        cy.location().should((loc) => {
          expect(loc.pathname).to.eq("/");
        });
      });
    cy.get("nav").contains("John Doe");
  });
});

describe("View Profile", function () {
  it("Navigate to personal profile", function () {
    cy.wait(4000)
    // Navigate to personal profile
    cy.get("span")
      .contains("expand_more")
      .click()
      .then((res) => {
        cy.get(".dropdown").should("be.visible");
      });
    cy.get(".dropdown-item")
      .first()
      .click()
      .then((res) => {
        cy.location().should((loc) => {
          expect(loc.pathname).to.eq("/my-profile");
        });
      });
  });

  it("Check profile elements", function () {
    // Check basic elements of personal profile
    cy.get(".profile-banner").contains("John Doe");
    cy.get(".profile-banner").contains("Friends");
    cy.get(".profile-banner").contains("Posts");
    cy.get(".profile-banner").contains("Stats");
  });
});

describe("Find Hikes", function () {
  it("Search up a hike", function () {
    // Navigate to find hikes page
    cy.get(".nav-button").contains("Find Hikes").click();
    // Search up the Watchung hike
    cy.get(".hike-search-input").type("Watchung");
    cy.get(".hike-search-button")
      .click()
      .then((res) => {
        cy.wait(2000);
        cy.get(".hike-card").first().contains("Watchung Reservation Loop");
      });
  });

  it("Get hike popout", function () {
    // Click on the Watchung hike
    cy.get(".hike-name")
      .click()
      .then((res) => {
        cy.wait(2000);
        cy.get(".hike-popout").should("be.visible");
      });

    // Close Watchung hike popout
    cy.get(".close")
      .click()
      .then((res) => {
        cy.get(".hike-popout").should("not.exist");
      });
  });
});

describe("Logout", function () {
  it("Logout", function () {
    // Logout and check that currUser is null
    cy.get("span")
      .contains("expand_more")
      .click()
      .then((res) => {
        cy.get(".dropdown").should("be.visible");
      });
    cy.get(".logout-item")
      .click()
      .then((res) => {
        cy.get(".login-button").should("be.visible");
      });

    // Check that user is navigated to home page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/");
    });
  });
});
