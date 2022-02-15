import React, { useState } from 'react';
// ALGOLIA'S IMPORT
// eslint-disable-next-line import/order
import { DynamicWidgets, connectRefinementList } from 'react-instantsearch-dom';

// import config file for state of facets
import { useRecoilState } from 'recoil';

// Import components
import { Glass } from '../../assets/svg/SvgIndex';
import PriceSlider from './PriceSlider';
// Import Config
import { configAtom } from '../../config/config';
import CustomHierarchicalMenu from './Hierarchical';

// expects an attribute which is an array of items
const RefinementList = ({ title, items, refine, searchForItems, options }) => {
  const [showfacet, setshowfacet] = useState(false);
  const [searchInput, setSearchInput] = useState(false);
  return (
    <div className="filters-container">
      <div className="filters-container__title">
        <h3>{title}</h3>
        {options.searchable && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            onClick={() => {
              setSearchInput(!searchInput);
            }}
          >
            <Glass />
          </div>
        )}
      </div>
      <div className="filters-container__list">
        {searchInput && (
          <input
            className={`${
              showfacet
                ? 'filters-container__list__search-facet'
                : 'filters-container__list__search-facet__hidden'
            }`}
            type="search"
            placeholder="Search"
            onChange={(event) => {
              searchForItems(event.currentTarget.value);
            }}
          />
        )}
      </div>
      <ul className="filters-container__content">
        {items.map((item) => (
          <li className="filters-container__content__list" key={item.value}>
            <button
              className={`filters-container__content__list__button-filter ${
                item.isRefined ? 'refined-filter' : ''
              }`}
              type="button"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                refine(item.value);
              }}
            >
              <p>{item.label}</p>
              <span className="filters-container__content__list__refinement-count">
                {item.count}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const GenericRefinementList = connectRefinementList(RefinementList);

const Facets = () => {
  const [config] = useRecoilState(configAtom);
  const refinementParams = config.refinements;
  return (
    <DynamicWidgets>
      {refinementParams.map((e, i) => {
        const refinementType = e.type;
        if (refinementType !== 'price' && refinementType !== 'hierarchical') {
          return (
            <GenericRefinementList
              searchable={e.options?.searchable}
              key={i}
              limit={e.options?.limit}
              attribute={e.options.attribute}
              title={e.label}
              options={e.options}
            />
          );
        }
        if (refinementType === 'price') {
          return (
            <PriceSlider
              attribute={e.options.attribute}
              title={e.label}
              currency={e.currency}
              key={i}
            />
          );
        }
        if (refinementType === 'hierarchical') {
          return (
            <CustomHierarchicalMenu
              attributes={e.options.attribute}
              title={e.label}
              key={i}
            />
          );
        }
      })}
    </DynamicWidgets>
  );
};

export default Facets;