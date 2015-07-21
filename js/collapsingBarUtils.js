var CollapsingBarUtils = {

  // /**
  //  * @param barWidth numeric.
  //  * @param orderedItems array of left to right ordered items.
  //  * Each item has property collapsable:boolean. It also has
  //  * a minimum width property, named @param minName.
  //  * @param minName string that is the name for looking up the minimum width of a given item.
  //  * @return {fit:[items that fit in the barWidth], dropped:[items that did not fit]}.
  //  * Note: items which do not meet the item spec will be removed and not appear in the results.
  //  */
  collapse: function( barWidth, orderedItems, minName ) {
    if( Number.isNaN( barWidth ) || barWidth === undefined ) { return orderedItems; }
    if( ! orderedItems ) { return []; }
    if( minName === undefined ) { return orderedItems; }
    var self = this;
    var validItems = orderedItems.filter( function(i) { return self._isValid(i,minName); } );
    return this._collapse( barWidth, validItems, minName );
  },

  _isValid: function( item, minName ) {
    var valid = (item !== undefined) && (item[minName] !== undefined) && (item[minName] >= 0) && (item.collapsable !== undefined);
    return valid;
  },

  _collapse: function( barWidth, orderedItems, minName ) {  
    var r = { fit : orderedItems.slice(), dropped : [] };
    var usedWidth = orderedItems.reduce( function(p,c,i,a) { return p+c[minName]; }, 0 );
    for( var i = orderedItems.length-1; i >= 0 && usedWidth > barWidth; --i ) {
      var item = orderedItems[ i ];
      if( !this._isValid( item, minName ) || item.collapsable ) {
        usedWidth = this._dropLastItemMatching(r, item, minName, usedWidth);
      }
    }
    return r;
  },

  _dropLastItemMatching: function( results, item, minName, usedWidth ) {
    var i = results.fit.lastIndexOf( item );
    if( i > -1 ) {
      results.fit.splice( i, 1 );
      results.dropped.unshift( item );
      if( item[minName] ) {
        usedWidth -= item[minName];
      }
    }
    return usedWidth;
  },

  TestSuite: {
    Assert: function() {
      var b = arguments[0];
      if( ! b ) {
        throw new Error( 'ASSERTION FAILED: ' + JSON.stringify(arguments) );
      }
    },
    AssertStrictEquals: function() {
      var o1 = arguments[0];
      var o2 = arguments[1];
      if( o1 !== o2 ) {
        var errorMessage = 'ASSERTION FAILED: ' + JSON.stringify(o1) + ' !== ' + JSON.stringify(o2);
        if( arguments.length > 2 ) {
          errorMessage += " (" + JSON.stringify(Array.prototype.slice.call(arguments, 2)) + ")";
        }
        throw new Error( errorMessage );
      }
    },

    // _F means 'fixed' or 'featured' (old terminology): not collapsible.
    // _C means 'collapsible'.
    B1_Fixed100 : 	{name : "b1", collapsable : false,	minWidth : 100},
    B2_Fixed1 : 		{name : "b2", collapsable : false,	minWidth : 1},
    B3_Fixed1 : 		{name : "b3", collapsable : false,	minWidth : 1},
    B4_Collapsing100 : 	{name : "b4", collapsable : true,	minWidth : 100},
    B5_Collapsing1 : 		{name : "b5", collapsable : true,	minWidth : 1},
    B6_Collapsing2 : 		{name : "b6", collapsable : true,	minWidth : 1},

    TestDropped_dropAliasOnlyOnce: function() {
      var oi = [this.B5_Collapsing1, this.B6_Collapsing2, this.B5_Collapsing1];
      var results = CollapsingBarUtils.collapse( 1, oi, 'minWidth' );
      this.AssertStrictEquals( results.dropped.length, 1, results );
      this.AssertStrictEquals( results.dropped[0], this.B5_Collapsing1, results );
    },

    TestDropped_dropFixedMixed: function() {
      var oi = [this.B1_Fixed100, this.B5_Collapsing1];
      var results = CollapsingBarUtils.collapse( 1, oi, 'minWidth' );
      this.AssertStrictEquals( results.dropped.length, 1, results );
      this.AssertStrictEquals( results.dropped[0], this.B5_Collapsing1, results );
    },

    TestDropped_dropFixedSingle: function() {
      var oi = [this.B1_Fixed100];
      var results = CollapsingBarUtils.collapse( 1, oi, 'minWidth' );
      this.AssertStrictEquals( results.dropped.length, 0, results );
    },

    TestFit_fixedPreferred: function() {
      var oi = [this.B2_Fixed1, this.B5_Collapsing1, this.B3_Fixed1];
      var results = CollapsingBarUtils.collapse( 2, oi, 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 2, results );
      this.Assert( results.fit.indexOf( this.B5_Collapsing1 ) == -1, results );
    },

    TestFit_merging: function() {
      var oi = [this.B2_Fixed1, this.B5_Collapsing1, this.B3_Fixed1 ];
      var results = CollapsingBarUtils.collapse( 100, oi, 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 3, results );
      this.AssertStrictEquals( results.fit.toString(), oi.toString(), results );
    },

    TestFit_revKeepFixed: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_Collapsing100, this.B1_Fixed100], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B1_Fixed100, results );
    },

    TestFit_keepFixed: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B1_Fixed100, this.B4_Collapsing100], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B1_Fixed100, results );
    },

    TestFit_revOneCollapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B5_Collapsing1, this.B4_Collapsing100], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B5_Collapsing1, results );
    },

    TestFit_oneCollapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_Collapsing100, this.B5_Collapsing1], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B4_Collapsing100, results );
    },

    TestFit_collapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_Collapsing100], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B4_Collapsing100, results );
    },

    TestFit_allFixedFit: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B2_Fixed1, this.B3_Fixed1], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 2, results );
      this.AssertStrictEquals( results.fit[0], this.B2_Fixed1, results );
      this.AssertStrictEquals( results.fit[1], this.B3_Fixed1, results );
    },

    TestFit_revOneFixedFits_twoFixed: function() {
      var oi = [this.B2_Fixed1, this.B1_Fixed100];
      var results = CollapsingBarUtils.collapse( 100, oi, 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 2, results );
      this.AssertStrictEquals( results.fit.toString(), oi.toString(), results );
    },

    TestFit_oneFixedFits_twoFixed: function() {
      var oi = [this.B1_Fixed100, this.B2_Fixed1];
      var results = CollapsingBarUtils.collapse( 100, oi, 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 2, results );
      this.AssertStrictEquals( results.fit.toString(), oi.toString(), results );
    },

    TestFit_keepItemMeetingSpec: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B2_Fixed1], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1, results );
    },

    TestFit_discardInvalidItem_dropped: function() {
      var results = CollapsingBarUtils.collapse( 100, [{name:"b1", collapsable:false}], 'minWidth' );
      this.AssertStrictEquals( results.dropped.length, 0, results );
    },

    TestFit_discardInvalidItem_fit: function() {
      var results = CollapsingBarUtils.collapse( 100, [{name:"b1", collapsable:false}], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 0, results );
    },

    TestFit_discardInvalidItemsInZeroSpace: function() {
      var results = CollapsingBarUtils.collapse( 0, [this.B2_Fixed1, {name:"b1", collapsable:false}], 'minWidth' );
      this.AssertStrictEquals( results.fit.length, 1, results );
    },

    TestFit_variousEdgeCasesDoNotExplode: function() {
      var sizes = [undefined, null, -1, 0, -4096, 4096];
      var items = [undefined, null, [], ["foo"]];
      for( var si = 0; si < sizes.length; ++si ) {
        for( var ii = 0; ii < items.length; ++ii ) {
          // not saying it returns anything sane, just doesn't die.
          CollapsingBarUtils.collapse( sizes[si], items[ii], 'minWidth' );
        }
      }
    },

    Run: function() {
      var keys = Object.keys( this ).sort();
      for( var i = 0; i < keys.length; ++i ) {
        var k = keys[i];
        var isFunction = typeof(this[k]) == "function";
        var isTest = k.indexOf("Test") === 0;
        if( isFunction && isTest ) {
          console.log( "+++", k );
          this[k]();
          console.log( "---",  k, "PASS!" );
        }
      }
      console.log( "ran", keys.length, "tests." );
    },
  },
};