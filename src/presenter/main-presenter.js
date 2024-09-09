import { render, replace } from '../framework/render.js';
import { isEscapeKey, isEmpty } from '../utils/common.js';
import FormEditView from '../view/form-edit-view.js';
import DestinationPointView from '../view/destination-point-view.js';
import DestinationPointsView from '../view/destination-points-view.js';
import DestinationEmptyView from '../view/destination-empty-view.js';
import SortView from '../view/sort-view.js';

export default class MainPresenter {
  #container = null;
  #model = null;
  #destinationPointsView = new DestinationPointsView();

  constructor({container, model}) {
    this.#container = container;
    this.#model = model;
    this.#destinationPointsView = new DestinationPointsView();
  }

  init() {
    this.#renderSortView();
    this.#renderTripPoints(this.#model);
  }

  #renderEmptyView() {
    render(new DestinationEmptyView({filter: this.#model.filters[0]}), this.#container);
  }

  #renderSortView() {
    render(new SortView(), this.#container);
  }

  #renderTripPoints({tripPoints}) {
    if (isEmpty(tripPoints)){
      this.#renderEmptyView();
      return;
    }

    for (let i = 0; i < tripPoints.length; i++) {
      render(this.#destinationPointsView, this.#container);
      this.#renderTripPoint(tripPoints[i]);
    }
  }

  #renderTripPoint(tripPoint) {
    const offers = this.#model.offers;
    const destinations = this.#model.destinations;

    const onEscKeydown = () => {
      if (isEscapeKey) {
        switchToViewMode();
      }
    };

    const onEditClick = () => switchToEditMode();
    const onFormSubmit = () => switchToViewMode();
    const onFormCancel = () => switchToViewMode();

    const destinationPointView = new DestinationPointView({
      // eslint-disable-next-line no-undef
      tripPoint,
      offers,
      destinations,
      onEditClick: onEditClick,
    });

    const formEditView = new FormEditView({
      // eslint-disable-next-line no-undef
      tripPoint,
      offers,
      destinations,
      onFormSubmit: onFormSubmit,
      onFormCancel: onFormCancel,
    });

    function switchToEditMode() {
      replace(formEditView, destinationPointView);
      document.addEventListener('keydown', onEscKeydown);
    }

    function switchToViewMode() {
      replace(destinationPointView, formEditView);
      document.removeEventListener('keydown', onEscKeydown);
    }

    render(destinationPointView, this.#destinationPointsView.element);
  }
}

