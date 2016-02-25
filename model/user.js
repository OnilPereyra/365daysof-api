const assert = require('assert');
const typeCheck = require('underscore');
const functional = require('ramda');
const validityCheck = require('validator');

const mergeInto = require('../utilities/merge-into');
const createGoal = require('./goal');

const pick = functional.pick;
const reject = functional.reject;
const compose = functional.compose;
const contains = functional.contains;
const whereEquals = functional.whereEq;

const DEFAULT_USER_STATE = {
  name: '',
  goals: [],
  challenges: [],
  roleModels: []
};

const USER_REFERENCE_FIELDS = ['email'];

/**
 * Creates an `User`.
 *
 * A `User` is a person trying to achieve a goal.
 * A `User` has a list of **goals** he/she's trying to achieve.
 * A `User` has a list of **challenges** other users have put him/her.
 * A `User` has a list of **role models** who he/she follows and inspire him with their progress.
 *
 * @api public
 * @param {Object} base
 * @param {String} base.name
 * @param {String} base.email
 * @return {User}
 */
function createUser(state) {
  state = Object.assign({}, DEFAULT_USER_STATE, state);

  const name = state.name;
  const email = state.email;

  const goals = state.goals.map(createGoal);
  const challenges = state.challenges.map(createGoal);
  const roleModels = state.roleModels.map(createUser);

  const user = {
    /**
     * @api public
     * @type {String}
     */
    name,
    /**
     * A `User`'s e-mail.
     * Used as an unique **identifier**.
     *
     * @api public
     * @return {String}
     * @readonly
     */
    get email() {
      return email;
    },
    /**
     * List of `Goal` a person is trying to achieve.
     * @api public
     * @return {Goal[]}
     * @readonly
     */
    get goals() {
      return goals;
    },
    /**
     * List of `Goal` that were put by someone else a person's trying to achieve.
     * @api public
     * @return {Goal[]}
     * @readonly
     */
    get challenges() {
      return challenges;
    },
    /**
     * List of `User` a person is inspired to follow.
     * @api public
     * @return {User[]}
     * @readonly
     */
    get roleModels() {
      return roleModels;
    },
    /**
     * Cancels a `Goal` an `User` was chasing for.
     * @param {Goal} goal Goal a person is no longer chasing for.
     * @return {User} `self`
     */
    forfeitGoal(goal) {
      goals = reject(whereEquals(goal), goals);

      return user;
    },
    /**
     * Marks another user as to be followed.
     * @param {User} roleModel User `self` is inspired by.
     * @return {User} `self`
     */
    addRoleModel(newRoleModel) {
      const fromRoleModel = createUser(newRoleModel);
      const roleModelReference = pick(USER_REFERENCE_FIELDS, fromRoleModel);

      if (!contains(roleModelReference, roleModels)) {
        roleModels.push(roleModelReference);
      }

      return user;
    },
    /**
     * Adds a new goal `self` is trying to achieve.
     * @param  {Goal} newGoal
     * @return {User} `self`
     */
    chaseNewGoal(newGoal) {
      newGoal = createGoal(newGoal);

      if (!contains(newGoal, goals)) goals.push(newGoal);

      return user;
    },
    /**
     * Un-marks another user so `self` no longer follows it.
     * @param  {User} roleModel
     * @return {User} `self`
     */
    removeRoleModel(roleModel) {
      roleModels = reject(whereEquals(roleModel), roleModels);

      return user;
    },
    /**
     * Removes a goal an user was challenged to chase for.
     * @param  {Goal} challenge
     * @return {User} `self`
     */
    forfeitChallenge(challenge) {
      challenges = reject(whereEquals(challenge), challenges);

      return user;
    },
  }

  return mergeInto(state, user);
}

function validateUser(state) {
  state = state || {};

  const name = state.name;
  const email = state.email;
  const goals = state.goals;
  const challenges = state.challenges;
  const roleModels = state.roleModels;

  if (name) {
    assert(typeCheck.isString(name), '`name` must be a string.');
  }

  assert(email, '`email` must be truthy');
  assert(typeCheck.isString(email), '`email` must be a string.');
  assert(validityCheck.isEmail(email), '`email` must be a valid e-mail.');

  if (goals) {
    assert(typeCheck.isArray(goals), '`goals` must be an array.');
  }

  if (challenges) {
    assert(typeCheck.isArray(challenges), '`challenges` must be an array.');
  }

  if (roleModels) {
    assert(typeCheck.isArray(roleModels), '`roleModels` must be an array.');
  }

  return state;
}

module.exports = compose(createUser, validateUser);
