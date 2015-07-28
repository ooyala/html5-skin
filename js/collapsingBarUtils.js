var CollapsingBarUtils = {

  // @param barWidth numeric.
  // @param orderedItems array of left to right ordered items. Each item meets the skin's "button" schema.
  // @return {fit:[items that fit in the barWidth], overflow:[items that did not fit]}.
  // Note: items which do not meet the item spec will be removed and not appear in the results.
  collapse: function( barWidth, orderedItems ) {
    if( isNaN( barWidth ) || barWidth === undefined ) { return orderedItems; }
    if( ! orderedItems ) { return []; }
    var self = this;
    var validItems = orderedItems.filter( function(item) { return self._isValid(item); } );
    var r = this._collapse( barWidth, validItems );
    return r;
  },

  _isValid: function( item ) {
    var valid = (
      item &&
      item.location == "moreOptions" ||
      (item.location == "controlBar" &&
        item.whenDoesNotFit &&
        item.minWidth !== undefined &&
        item.minWidth >= 0)
    );
    return valid;
  },

  _collapse: function( barWidth, orderedItems ) {
    var r = { fit : orderedItems.slice(), overflow : [] };
    var usedWidth = orderedItems.reduce( function(p,c,i,a) { return p+c.minWidth; }, 0 );
    for( var i = orderedItems.length-1; i >= 0; --i ) {
      var item = orderedItems[ i ];
      if( this._isOnlyInMoreOptions(item) ) {
        usedWidth = this._collapseLastItemMatching(r, item, usedWidth);
      }
      if( usedWidth > barWidth && this._isCollapsable(item) ) {
        usedWidth = this._collapseLastItemMatching(r, item, usedWidth);
      }
    }
    return r;
  },

  _isOnlyInMoreOptions: function( item ) {
    var must = item.location == "moreOptions";
    return must;
  },

  _isCollapsable: function( item ) {
    var collapsable = item.location == "controlBar" && item.whenDoesNotFit && item.whenDoesNotFit != "keep";
    return collapsable;
  },

  _collapseLastItemMatching: function( results, item, usedWidth ) {
    var i = results.fit.lastIndexOf( item );
    if( i > -1 ) {
      results.fit.splice( i, 1 );
      results.overflow.unshift( item );
      if( item.minWidth ) {
        usedWidth -= item.minWidth;
      }
    }
    return usedWidth;
  },

  _isOverflow: function( item ) {
    return item.whenDoesNotFit && item.whenDoesNotFit == "moveToMoreOptions";
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
    // _C means 'collapsible' (which can be overflow or just disappear).
    B1_Fixed100 :   {name : "b1", location : "controlBar",  whenDoesNotFit : "keep", minWidth : 100},
    B2_Fixed1 :     {name : "b2", location : "controlBar",  whenDoesNotFit : "keep", minWidth : 1},
    B3_Fixed1 :     {name : "b3", location : "controlBar",  whenDoesNotFit : "keep", minWidth : 1},
    B4_Collapsing100 :  {name : "b4", location : "controlBar",  whenDoesNotFit : "moveToMoreOptions", minWidth : 100},
    B5_Collapsing1 :    {name : "b5", location : "controlBar",  whenDoesNotFit : "moveToMoreOptions", minWidth : 1},
    B6_Collapsing1 :    {name : "b6", location : "controlBar",  whenDoesNotFit : "moveToMoreOptions", minWidth : 1},
    B7_MoreOptions100:  {name : "b7", location : "moreOptions", minWidth : 100},
    B8_None100:     {name : "b7", location : "", minWidth : 100},

    TestOverflow_overflowMoreOptionsDoesntCount: function() {
      var oi = [this.B5_Collapsing1, this.B7_MoreOptions100];
      var results = CollapsingBarUtils.collapse( 100, oi );
      this.AssertStrictEquals( results.overflow.length, 1, results );
      this.AssertStrictEquals( results.overflow[0], this.B7_MoreOptions100, results );
    },

    TestOverflow_overflowMoreOptionsFits: function() {
      var oi = [this.B7_MoreOptions100];
      var results = CollapsingBarUtils.collapse( 100, oi );
      this.AssertStrictEquals( results.overflow.toString(), oi.toString(), results );
    },

    TestOverflow_overflowMoreOptionsDoesNotFit: function() {
      var oi = [this.B7_MoreOptions100];
      var results = CollapsingBarUtils.collapse( 1, oi );
      this.AssertStrictEquals( results.overflow.toString(), oi.toString(), results );
    },

    TestOverflow_overflowAppearanceNoneFits: function() {
      var oi = [this.B8_None100];
      var results = CollapsingBarUtils.collapse( 100, oi );
      this.AssertStrictEquals( results.overflow.length, 0, results );
    },

    TestOverflow_overflowAppearanceNoneDoesNotFit: function() {
      var oi = [this.B8_None100];
      var results = CollapsingBarUtils.collapse( 1, oi );
      this.AssertStrictEquals( results.overflow.length, 0, results );
    },

    TestOverflow_overflowAliasOnlyOnce: function() {
      var oi = [this.B5_Collapsing1, this.B6_Collapsing1, this.B5_Collapsing1];
      var results = CollapsingBarUtils.collapse( 2, oi );
      this.AssertStrictEquals( results.overflow.length, 1, results );
      this.AssertStrictEquals( results.overflow[0], this.B5_Collapsing1, results );
    },

    TestOverflow_overflowFixedMixed: function() {
      var oi = [this.B1_Fixed100, this.B5_Collapsing1];
      var results = CollapsingBarUtils.collapse( 1, oi );
      this.AssertStrictEquals( results.overflow.length, 1, results );
      this.AssertStrictEquals( results.overflow[0], this.B5_Collapsing1, results );
    },

    TestOverflow_overflowFixedSingle: function() {
      var oi = [this.B1_Fixed100];
      var results = CollapsingBarUtils.collapse( 1, oi );
      this.AssertStrictEquals( results.overflow.length, 0, results );
    },

    TestFit_fixedPreferred: function() {
      var oi = [this.B2_Fixed1, this.B5_Collapsing1, this.B3_Fixed1];
      var results = CollapsingBarUtils.collapse( 2, oi );
      this.AssertStrictEquals( results.fit.length, 2, results );
      this.Assert( results.fit.indexOf( this.B5_Collapsing1 ) == -1, results );
    },

    TestFit_merging: function() {
      var oi = [this.B2_Fixed1, this.B5_Collapsing1, this.B3_Fixed1 ];
      var results = CollapsingBarUtils.collapse( 100, oi );
      this.AssertStrictEquals( results.fit.length, 3, results );
      this.AssertStrictEquals( results.fit.toString(), oi.toString(), results );
    },

    TestFit_revKeepFixed: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_Collapsing100, this.B1_Fixed100] );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B1_Fixed100, results );
    },

    TestFit_keepFixed: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B1_Fixed100, this.B4_Collapsing100] );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B1_Fixed100, results );
    },

    TestFit_revOneCollapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B5_Collapsing1, this.B4_Collapsing100] );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B5_Collapsing1, results );
    },

    TestFit_oneCollapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_Collapsing100, this.B5_Collapsing1] );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B4_Collapsing100, results );
    },

    TestFit_collapsableFits: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B4_Collapsing100] );
      this.AssertStrictEquals( results.fit.length, 1, results );
      this.AssertStrictEquals( results.fit[0], this.B4_Collapsing100, results );
    },

    TestFit_allFixedFit: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B2_Fixed1, this.B3_Fixed1] );
      this.AssertStrictEquals( results.fit.length, 2, results );
      this.AssertStrictEquals( results.fit[0], this.B2_Fixed1, results );
      this.AssertStrictEquals( results.fit[1], this.B3_Fixed1, results );
    },

    TestFit_revOneFixedFits_twoFixed: function() {
      var oi = [this.B2_Fixed1, this.B1_Fixed100];
      var results = CollapsingBarUtils.collapse( 100, oi );
      this.AssertStrictEquals( results.fit.length, 2, results );
      this.AssertStrictEquals( results.fit.toString(), oi.toString(), results );
    },

    TestFit_oneFixedFits_twoFixed: function() {
      var oi = [this.B1_Fixed100, this.B2_Fixed1];
      var results = CollapsingBarUtils.collapse( 100, oi );
      this.AssertStrictEquals( results.fit.length, 2, results );
      this.AssertStrictEquals( results.fit.toString(), oi.toString(), results );
    },

    TestFit_keepItemMeetingSpec: function() {
      var results = CollapsingBarUtils.collapse( 100, [this.B2_Fixed1] );
      this.AssertStrictEquals( results.fit.length, 1, results );
    },

    TestFit_discardInvalidItem_overflow: function() {
      var results = CollapsingBarUtils.collapse( 100, [{name:"b1", appearance:"controlBar"}] );
      this.AssertStrictEquals( results.overflow.length, 0, results );
    },

    TestFit_discardInvalidItem_fit: function() {
      var results = CollapsingBarUtils.collapse( 100, [{name:"b1", appearance:"controlBar"}] );
      this.AssertStrictEquals( results.fit.length, 0, results );
    },

    TestFit_discardInvalidItemsInZeroSpace: function() {
      var results = CollapsingBarUtils.collapse( 0, [this.B2_Fixed1, {name:"b1", appearance:"controlBar"}] );
      this.AssertStrictEquals( results.fit.length, 1, results );
    },

    TestFit_variousEdgeCasesDoNotExplode: function() {
      var sizes = [undefined, null, -1, 0, -4096, 4096];
      var items = [undefined, null, [], ["foo"]];
      for( var si = 0; si < sizes.length; ++si ) {
        for( var ii = 0; ii < items.length; ++ii ) {
          // not saying it returns anything sane, just doesn't die.
          CollapsingBarUtils.collapse( sizes[si], items[ii] );
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

