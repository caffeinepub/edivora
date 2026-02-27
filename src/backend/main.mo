import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Set "mo:core/Set";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Component integration
  include MixinStorage();
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Data Types
  public type UserProfile = {
    name : Text;
    grade : Nat;
    subjects : [Text];
    voicePersona : Text;
  };

  type Lesson = {
    grade : Nat;
    subject : Text;
    day : Nat;
    title : Text;
    content : Text;
  };

  type QuizQuestion = {
    grade : Nat;
    subject : Text;
    question : Text;
    options : [Text];
    correctIndex : Nat;
    explanation : Text;
  };

  type QuizAttempt = {
    questions : [QuizQuestion];
    answers : [Nat];
    score : Int;
  };

  type HomeworkItem = {
    id : Text;
    subject : Text;
    description : Text;
    dueDate : Text;
    completed : Bool;
  };

  // Persistent Data Structures
  let userProfiles = Map.empty<Principal, UserProfile>();
  let lessons = List.empty<Lesson>();
  let quizzes = List.empty<QuizQuestion>();
  let completedLessons = Map.empty<Principal, Set.Set<Text>>();
  let quizAttempts = Map.empty<Principal, List.List<QuizAttempt>>();
  let homework = Map.empty<Principal, List.List<HomeworkItem>>();
  let userAudio = Map.empty<Principal, Storage.ExternalBlob>();

  // Comparisons
  module Lesson {
    public func compare(a : Lesson, b : Lesson) : Order.Order {
      switch (Nat.compare(a.grade, b.grade)) {
        case (#equal) {
          switch (Text.compare(a.subject, b.subject)) {
            case (#equal) { Nat.compare(a.day, b.day) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  module QuizQuestion {
    public func compare(a : QuizQuestion, b : QuizQuestion) : Order.Order {
      switch (Nat.compare(a.grade, b.grade)) {
        case (#equal) {
          switch (Text.compare(a.subject, b.subject)) {
            case (#equal) { Text.compare(a.question, b.question) };
            case (order) { order };
          };
        };
        case (order) { order };
      };
    };
  };

  module HomeworkItem {
    public func compare(a : HomeworkItem, b : HomeworkItem) : Order.Order {
      switch (Text.compare(a.subject, b.subject)) {
        case (#equal) { Text.compare(a.dueDate, b.dueDate) };
        case (order) { order };
      };
    };
  };

  // User Profile Functions (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (profile.grade < 6 or profile.grade > 12) {
      Runtime.trap("Grade must be between 6 and 12");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func uploadAudio(blob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload audio");
    };
    userAudio.add(caller, blob);
  };

  public query ({ caller }) func getAudio() : async ?Storage.ExternalBlob {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access audio");
    };
    userAudio.get(caller);
  };

  // Lessons
  public shared ({ caller }) func addLesson(lesson : Lesson) : async () {
    if (lesson.grade < 6 or lesson.grade > 12) {
      Runtime.trap("Grade must be between 6 and 12");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add lessons");
    };
    lessons.add(lesson);
  };

  public query ({ caller }) func getLesson(grade : Nat, subject : Text, day : Nat) : async ?Lesson {
    if (grade < 6 or grade > 12) {
      Runtime.trap("Grade must be between 6 and 12");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view lessons");
    };
    lessons.find(
      func(lesson) {
        lesson.grade == grade and lesson.subject == subject and lesson.day == day
      }
    );
  };

  public query ({ caller }) func getLessonTitles(grade : Nat, subject : Text) : async [Text] {
    if (grade < 6 or grade > 12) {
      Runtime.trap("Grade must be between 6 and 12");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view lesson titles");
    };
    lessons.filter(
      func(lesson) {
        lesson.grade == grade and lesson.subject == subject
      }
    ).values().toArray().map(func(lesson) { lesson.title });
  };

  // Quizzes
  public shared ({ caller }) func addQuizQuestion(quiz : QuizQuestion) : async () {
    if (quiz.grade < 6 or quiz.grade > 12) {
      Runtime.trap("Grade must be between 6 and 12");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add quiz questions");
    };
    quizzes.add(quiz);
  };

  public query ({ caller }) func getQuestions(grade : Nat, subject : Text) : async [QuizQuestion] {
    if (grade < 6 or grade > 12) {
      Runtime.trap("Grade must be between 6 and 12");
    };
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view quiz questions");
    };
    quizzes.filter(
      func(q) {
        q.grade == grade and q.subject == subject
      }
    ).values().toArray();
  };

  public shared ({ caller }) func submitAttempt(questions : [QuizQuestion], answers : [Nat]) : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit quiz attempts");
    };

    let numQuestions = questions.size();
    if (answers.size() != numQuestions) {
      Runtime.trap("Number of answers must match number of questions");
    };

    var score = 0;
    for (i in Nat.range(0, numQuestions)) {
      if (answers[i] == questions[i].correctIndex) {
        score += 1;
      };
    };

    let attempt = {
      questions;
      answers;
      score;
    };

    let existingAttempts = switch (quizAttempts.get(caller)) {
      case (null) { List.empty<QuizAttempt>() };
      case (?attempts) { attempts };
    };

    existingAttempts.add(attempt);
    quizAttempts.add(caller, existingAttempts);
    score;
  };

  public query ({ caller }) func getQuizHistory() : async [QuizAttempt] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view quiz history");
    };
    switch (quizAttempts.get(caller)) {
      case (null) { [] };
      case (?attempts) { attempts.values().toArray() };
    };
  };

  // Homework
  public shared ({ caller }) func addHomework(homeworkItem : HomeworkItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add homework");
    };

    let existingHomework = switch (homework.get(caller)) {
      case (null) { List.empty<HomeworkItem>() };
      case (?items) { items };
    };

    existingHomework.add(homeworkItem);
    homework.add(caller, existingHomework);
  };

  public shared ({ caller }) func markHomeworkDone(homeworkId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark homework as done");
    };

    switch (homework.get(caller)) {
      case (null) { return };
      case (?items) {
        let updatedItems = items.map<HomeworkItem, HomeworkItem>(
          func(item) {
            if (item.id == homeworkId) {
              {
                id = item.id;
                subject = item.subject;
                description = item.description;
                dueDate = item.dueDate;
                completed = true;
              };
            } else {
              item;
            };
          }
        );
        homework.add(caller, updatedItems);
      };
    };
  };

  public query ({ caller }) func getHomework() : async [HomeworkItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view homework");
    };
    switch (homework.get(caller)) {
      case (null) { [] };
      case (?items) { items.values().toArray() };
    };
  };

  // Progress - Completed Lessons
  public shared ({ caller }) func markLessonCompleted(lessonId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark lessons as completed");
    };

    let completed = switch (completedLessons.get(caller)) {
      case (null) {
        let newSet = Set.empty<Text>();
        newSet.add(lessonId);
        newSet;
      };
      case (?lessons) {
        lessons.add(lessonId);
        lessons;
      };
    };

    completedLessons.add(caller, completed);
  };

  public query ({ caller }) func getCompletedLessons() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view completed lessons");
    };
    switch (completedLessons.get(caller)) {
      case (null) { [] };
      case (?lessons) { lessons.values().toArray() };
    };
  };

  public query ({ caller }) func getProgressStats() : async { completedLessons : Nat; completedQuizzes : Nat } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view progress stats");
    };

    let numCompletedLessons = switch (completedLessons.get(caller)) {
      case (null) { 0 };
      case (?lessons) { lessons.size() };
    };

    let numCompletedQuizzes = switch (quizAttempts.get(caller)) {
      case (null) { 0 };
      case (?attempts) { attempts.size() };
    };

    {
      completedLessons = numCompletedLessons;
      completedQuizzes = numCompletedQuizzes;
    };
  };
};
