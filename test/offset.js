var path = require('path');
var offset = require('../offset');
var setOffset = require('../set-offset');
var assert = require('assert-expect');
var forceScroll;
var supportsScroll;
var supportsFixedPosition;
// global.document = jsdom(undefined, {});
// global.window = document.defaultView;
// document.documentElement.scrollTop = 0;
// document.documentElement.scrollLeft = 0;
// document.body.scrollTop = 0;
// document.body.scrollLeft = 0;
forceScroll = document.createElement('div');
forceScroll.style.width = "2000px";
forceScroll.style.height = "2000px";
var QUnit = {
    test: function () {}
};
it.never = function () {};
var testIframe = function () {};
describe( "offset", function () {
    var fixture;
    beforeEach(function () {
        // Force a scroll value on the main window to ensure incorrect results
        // if offset is using the scroll offset of the parent window
        document.body.innerHTML = window.__html__['test/fixture.html'];
        document.body.appendChild(forceScroll);
        window.scrollTo( 1, 1 );
        forceScroll.remove();
    });
    afterEach(function () {
        assert.finished();
    });
    /*
        Closure-compiler will roll static methods off of the jQuery object and so they will
        not be passed with the jQuery object across the windows. To differentiate this, the
        testIframe callbacks use the "$" symbol to refer to the jQuery object passed from
        the iframe window and the "jQuery" symbol is used to access any static methods.
    */

    it( "empty set", function () {
        assert.expect( 1 );
        assert.strictEqual( offset(), undefined, "offset() returns undefined for empty set (#11962)" );
    } );

    it( "disconnected element", function () {
        assert.expect( 2 );

        var result = offset( document.createElement( "div" ) );

        // These tests are solely for master/compat consistency
        // Retrieving offset on disconnected/hidden elements is not officially
        // valid input, but will return zeros for back-compat
        assert.equal( result.top, 0, "Retrieving offset on disconnected elements returns zeros (gh-2310)" );
        assert.equal( result.left, 0, "Retrieving offset on disconnected elements returns zeros (gh-2310)" );
    } );

    it( "hidden (display: none) element", function () {
        assert.expect( 2 );
        var node = document.createElement('div');
        node.style.display='none';
        document.body.querySelector('#qunit-fixture').appendChild(node);
        var result = offset(node);

        node.remove();

        // These tests are solely for master/compat consistency
        // Retrieving offset on disconnected/hidden elements is not officially
        // valid input, but will return zeros for back-compat
        assert.equal( result.top, 0, "Retrieving offset on hidden elements returns zeros (gh-2310)" );
        assert.equal( result.left, 0, "Retrieving offset on hidden elements returns zeros (gh-2310)" );
    } );
    describe('absolute', function () {
        beforeEach(function () {
            beforeEach(function () {
                document.body.innerHTML = window.__html__['test/absolute.html'];
            });
        });
        it('offset', function () {
            // assert.expect( 4 );

            var doc = document;
            var tests;

            // get offset
            var absolute1 = document.querySelector('#absolute-1');
            test = {"top": 1, "left": 1 };
            assert.equal(
                offset(absolute1).top,
                test["top"],
                "offset(absolute1).top"
            );
            assert.equal(
                offset(absolute1).left,
                test["left"],
                "offset(absolute1).left"
            );

            // // get position
            // test = { "top": 0, "left": 0 };
            // assert.equal(
            //     absolute1.offsetTop,
            //     test["top"]
            // );
            // assert.equal(
            //     absolute1.offsetLeft,
            //     test["left"]
            // );
        });
        it.never( "offset/absolute, absolute", function() {
            // assert.expect( 178 );

            var tests;
            var elementOffset;

            // get offset tests
            tests = [
                { "id": "#absolute-1",     "top":  1, "left":  1 },
                { "id": "#absolute-1-1",   "top":  5, "left":  5 },
                { "id": "#absolute-1-1-1", "top":  9, "left":  9 },
                { "id": "#absolute-2",     "top": 20, "left": 20 }
            ];
            tests.forEach(function (test) {
                assert.equal( offset(document.querySelector( test[ "id" ] )).top, test[ "top" ],  "jQuery('" + test[ "id" ] + "').offset().top" );
                assert.equal( offset(document.querySelector( test[ "id" ] )).left, test[ "left" ], "jQuery('" + test[ "id" ] + "').offset().left" );
            } );
            // get position
            tests = [
                { "id": "#absolute-1",     "top":  0, "left":  0 },
                { "id": "#absolute-1-1",   "top":  1, "left":  1 },
                { "id": "#absolute-1-1-1", "top":  1, "left":  1 },
                { "id": "#absolute-2",     "top": 19, "left": 19 }
            ];
            // tests.forEach(function (test, index) {
            //                 console.log( 'index = ' + index);
            //     assert.equal(document.querySelector( test[ "id" ] ).offsetTop,  test[ "top" ]);
            //     assert.equal(document.querySelector( test[ "id" ] ).offsetLeft, test[ "left" ]);
            // } );

            // test #5781
            elementOffset = offset(offset(document.querySelector( "#positionTest" ), { "top": 10, "left": 10 } ));
            // "Setting offset on element with position absolute but 'auto' values."
            assert.equal( elementOffset.top,  10);
            assert.equal( elementOffset.left, 10, "Setting offset on element with position absolute but 'auto' values." );

            // set offset
            tests = [
                { "id": "#absolute-2",     "top": 30, "left": 30 },
                { "id": "#absolute-2",     "top": 10, "left": 10 },
                { "id": "#absolute-2",     "top": -1, "left": -1 },
                { "id": "#absolute-2",     "top": 19, "left": 19 },
                { "id": "#absolute-1-1-1", "top": 15, "left": 15 },
                { "id": "#absolute-1-1-1", "top":  5, "left":  5 },
                { "id": "#absolute-1-1-1", "top": -1, "left": -1 },
                { "id": "#absolute-1-1-1", "top":  9, "left":  9 },
                { "id": "#absolute-1-1",   "top": 10, "left": 10 },
                { "id": "#absolute-1-1",   "top":  0, "left":  0 },
                { "id": "#absolute-1-1",   "top": -1, "left": -1 },
                { "id": "#absolute-1-1",   "top":  5, "left":  5 },
                { "id": "#absolute-1",     "top":  2, "left":  2 },
                { "id": "#absolute-1",     "top":  0, "left":  0 },
                { "id": "#absolute-1",     "top": -1, "left": -1 },
                { "id": "#absolute-1",     "top":  1, "left":  1 }
            ];
            tests.forEach(function (test) {
                $( test[ "id" ] ).offset( { "top": test[ "top" ], "left": test[ "left" ] } );
                assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ],  "jQuery('" + test[ "id" ] + "').offset({ top: "  + test[ "top" ]  + " })" );
                assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ], "jQuery('" + test[ "id" ] + "').offset({ left: " + test[ "left" ] + " })" );

                var top = test[ "top" ], left = test[ "left" ];

                $( test[ "id" ] ).offset( function( i, val ) {
                    assert.equal( val.top, top, "Verify incoming top position." );
                    assert.equal( val.left, left, "Verify incoming top position." );
                    return { "top": top + 1, "left": left + 1 };
                } );
                assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ]  + 1, "jQuery('" + test[ "id" ] + "').offset({ top: "  + ( test[ "top" ]  + 1 ) + " })" );
                assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ] + 1, "jQuery('" + test[ "id" ] + "').offset({ left: " + ( test[ "left" ] + 1 ) + " })" );

                $( test[ "id" ] )
                    .offset( { "left": test[ "left" ] + 2 } )
                    .offset( { "top":  test[ "top" ]  + 2 } );
                assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ]  + 2, "Setting one property at a time." );
                assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ] + 2, "Setting one property at a time." );

                $( test[ "id" ] ).offset( { "top": test[ "top" ], "left": test[ "left" ], "using": function( props ) {
                    this.style.top = props.top + 1;
                    this.style.left = props.left + 1;
                } } );
                assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ]  + 1, "jQuery('" + test[ "id" ] + "').offset({ top: "  + ( test[ "top" ]  + 1 ) + ", using: fn })" );
                assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ] + 1, "jQuery('" + test[ "id" ] + "').offset({ left: " + ( test[ "left" ] + 1 ) + ", using: fn })" );
            } );
        } );
    });

    testIframe( "offset/relative", "relative", function( $, window, document, assert ) {
        assert.expect( 64 );

        // get offset
        var tests = [
            { "id": "#relative-1",   "top":   7, "left":  7 },
            { "id": "#relative-1-1", "top":  15, "left": 15 },
            { "id": "#relative-2",   "top": 142, "left": 27 },
            { "id": "#relative-2-1",   "top": 149, "left": 52 }
        ];
        tests.forEach(function (test) {
            assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ],  "jQuery('" + test[ "id" ] + "').offset().top" );
            assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ], "jQuery('" + test[ "id" ] + "').offset().left" );
        } );

        // get position
        tests = [
            { "id": "#relative-1",   "top":   6, "left":  6 },
            { "id": "#relative-1-1", "top":   5, "left":  5 },
            { "id": "#relative-2",   "top": 141, "left": 26 },
            { "id": "#relative-2-1",   "top": 5, "left": 5 }
        ];
        tests.forEach(function (test) {
            assert.equal( $( test[ "id" ] ).position().top,  test[ "top" ],  "jQuery('" + test[ "id" ] + "').position().top" );
            assert.equal( $( test[ "id" ] ).position().left, test[ "left" ], "jQuery('" + test[ "id" ] + "').position().left" );
        } );

        // set offset
        tests = [
            { "id": "#relative-2",   "top": 200, "left":  50 },
            { "id": "#relative-2",   "top": 100, "left":  10 },
            { "id": "#relative-2",   "top":  -5, "left":  -5 },
            { "id": "#relative-2",   "top": 142, "left":  27 },
            { "id": "#relative-1-1", "top": 100, "left": 100 },
            { "id": "#relative-1-1", "top":   5, "left":   5 },
            { "id": "#relative-1-1", "top":  -1, "left":  -1 },
            { "id": "#relative-1-1", "top":  15, "left":  15 },
            { "id": "#relative-1",   "top": 100, "left": 100 },
            { "id": "#relative-1",   "top":   0, "left":   0 },
            { "id": "#relative-1",   "top":  -1, "left":  -1 },
            { "id": "#relative-1",   "top":   7, "left":   7 }
        ];
        tests.forEach(function (test) {
            $( test[ "id" ] ).offset( { "top": test[ "top" ], "left": test[ "left" ] } );
            assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ],  "jQuery('" + test[ "id" ] + "').offset({ top: "  + test[ "top" ]  + " })" );
            assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ], "jQuery('" + test[ "id" ] + "').offset({ left: " + test[ "left" ] + " })" );

            $( test[ "id" ] ).offset( { "top": test[ "top" ], "left": test[ "left" ], "using": function( props ) {
                $( test ).css( {
                    "top":  props.top  + 1,
                    "left": props.left + 1
                } );
            } } );
            assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ]  + 1, "jQuery('" + test[ "id" ] + "').offset({ top: "  + ( test[ "top" ]  + 1 ) + ", using: fn })" );
            assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ] + 1, "jQuery('" + test[ "id" ] + "').offset({ left: " + ( test[ "left" ] + 1 ) + ", using: fn })" );
        } );
    } );

    testIframe( "offset/static", "static", function( $, window, document, assert ) {
        assert.expect( 80 );

        // get offset
        var tests = [
            { "id": "#static-1",     "top":   7, "left":  7 },
            { "id": "#static-1-1",   "top":  15, "left": 15 },
            { "id": "#static-1-1-1", "top":  23, "left": 23 },
            { "id": "#static-2",     "top": 122, left: 7 }
        ];
        tests.forEach(function (test) {
            assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ],  "jQuery('" + test[ "id" ] + "').offset().top" );
            assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ], "jQuery('" + test[ "id" ] + "').offset().left" );
        } );

        // get position
        tests = [
            { "id": "#static-1",     "top":   6, "left":  6 },
            { "id": "#static-1-1",   "top":  14, "left": 14 },
            { "id": "#static-1-1-1", "top":  22, "left": 22 },
            { "id": "#static-2",     "top": 121, "left": 6 }
        ];
        tests.forEach(function (test) {
            assert.equal( $( test[ "id" ] ).position().top,  test[ "top" ],  "jQuery('" + test[ "top" ]  + "').position().top" );
            assert.equal( $( test[ "id" ] ).position().left, test[ "left" ], "jQuery('" + test[ "left" ] + "').position().left" );
        } );

        // set offset
        tests = [
            { "id": "#static-2",     "top": 200, "left": 200 },
            { "id": "#static-2",     "top": 100, "left": 100 },
            { "id": "#static-2",     "top":  -2, "left":  -2 },
            { "id": "#static-2",     "top": 121, "left":   6 },
            { "id": "#static-1-1-1", "top":  50, "left":  50 },
            { "id": "#static-1-1-1", "top":  10, "left":  10 },
            { "id": "#static-1-1-1", "top":  -1, "left":  -1 },
            { "id": "#static-1-1-1", "top":  22, "left":  22 },
            { "id": "#static-1-1",   "top":  25, "left":  25 },
            { "id": "#static-1-1",   "top":  10, "left":  10 },
            { "id": "#static-1-1",   "top":  -3, "left":  -3 },
            { "id": "#static-1-1",   "top":  14, "left":  14 },
            { "id": "#static-1",     "top":  30, "left":  30 },
            { "id": "#static-1",     "top":   2, "left":   2 },
            { "id": "#static-1",     "top":  -2, "left":  -2 },
            { "id": "#static-1",     "top":   7, "left":   7 }
        ];
        tests.forEach(function (test) {
            $( test[ "id" ] ).offset( { "top": test[ "top" ], "left": test[ "left" ] } );
            assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ],  "jQuery('" + test[ "id" ] + "').offset({ top: "  + test[ "top" ]  + " })" );
            assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ], "jQuery('" + test[ "id" ] + "').offset({ left: " + test[ "left" ] + " })" );

            $( test[ "id" ] ).offset( { "top": test[ "top" ], "left": test[ "left" ], "using": function( props ) {
                $( this ).css( {
                    "top":  props.top  + 1,
                    "left": props.left + 1
                } );
            } } );
            assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ]  + 1, "jQuery('" + test[ "id" ] + "').offset({ top: "  + ( test[ "top" ]  + 1 ) + ", using: fn })" );
            assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ] + 1, "jQuery('" + test[ "id" ] + "').offset({ left: " + ( test[ "left" ] + 1 ) + ", using: fn })" );
        } );
    } );

    testIframe( "offset/fixed", "fixed", function( $, window, document, assert ) {
        assert.expect( 34 );

        var tests, $noTopLeft;

        tests = [
            {
                "id": "#fixed-1",
                "offsetTop": 1001,
                "offsetLeft": 1001,
                "positionTop": 0,
                "positionLeft": 0
            },
            {
                "id": "#fixed-2",
                "offsetTop": 1021,
                "offsetLeft": 1021,
                "positionTop": 20,
                "positionLeft": 20
            }
        ];

        tests.forEach(function (test) {
            if ( !window.supportsScroll ) {
                assert.ok( true, "Browser doesn't support scroll position." );
                assert.ok( true, "Browser doesn't support scroll position." );
                assert.ok( true, "Browser doesn't support scroll position." );
                assert.ok( true, "Browser doesn't support scroll position." );

            } else if ( window.supportsFixedPosition ) {
                assert.equal( $( test[ "id" ] ).offset().top,  test[ "offsetTop" ],  "jQuery('" + test[ "id" ] + "').offset().top" );
                assert.equal( $( test[ "id" ] ).position().top,  test[ "positionTop" ],  "jQuery('" + test[ "id" ] + "').position().top" );
                assert.equal( $( test[ "id" ] ).offset().left, test[ "offsetLeft" ], "jQuery('" + test[ "id" ] + "').offset().left" );
                assert.equal( $( test[ "id" ] ).position().left,  test[ "positionLeft" ],  "jQuery('" + test[ "id" ] + "').position().left" );
            } else {

                // need to have same number of assertions
                assert.ok( true, "Fixed position is not supported" );
                assert.ok( true, "Fixed position is not supported" );
                assert.ok( true, "Fixed position is not supported" );
                assert.ok( true, "Fixed position is not supported" );
            }
        } );

        tests = [
            { "id": "#fixed-1", "top": 100, "left": 100 },
            { "id": "#fixed-1", "top":   0, "left":   0 },
            { "id": "#fixed-1", "top":  -4, "left":  -4 },
            { "id": "#fixed-2", "top": 200, "left": 200 },
            { "id": "#fixed-2", "top":   0, "left":   0 },
            { "id": "#fixed-2", "top":  -5, "left":  -5 }
        ];

        tests.forEach(function (test) {
            if ( window.supportsFixedPosition ) {
                $( test[ "id" ] ).offset( { "top": test[ "top" ], "left": test[ "left" ] } );
                assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ],  "jQuery('" + test[ "id" ] + "').offset({ top: "  + test[ "top" ]  + " })" );
                assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ], "jQuery('" + test[ "id" ] + "').offset({ left: " + test[ "left" ] + " })" );

                $( test[ "id" ] ).offset( { "top": test[ "top" ], "left": test[ "left" ], "using": function( props ) {
                    this.style.top = props.top + 1;
                    this.style.left = props.left + 1;
                } } );
                assert.equal( $( test[ "id" ] ).offset().top,  test[ "top" ]  + 1, "jQuery('" + test[ "id" ] + "').offset({ top: "  + ( test[ "top" ]  + 1 ) + ", using: fn })" );
                assert.equal( $( test[ "id" ] ).offset().left, test[ "left" ] + 1, "jQuery('" + test[ "id" ] + "').offset({ left: " + ( test[ "left" ] + 1 ) + ", using: fn })" );
            } else {

                // need to have same number of assertions
                assert.ok( true, "Fixed position is not supported" );
                assert.ok( true, "Fixed position is not supported" );
                assert.ok( true, "Fixed position is not supported" );
                assert.ok( true, "Fixed position is not supported" );
            }
        } );

        // Bug 8316
        $noTopLeft = $( "#fixed-no-top-left" );
        if ( window.supportsFixedPosition ) {
            assert.equal( $noTopLeft.offset().top,  1007,  "Check offset top for fixed element with no top set" );
            assert.equal( $noTopLeft.offset().left, 1007, "Check offset left for fixed element with no left set" );
        } else {

            // need to have same number of assertions
            assert.ok( true, "Fixed position is not supported" );
            assert.ok( true, "Fixed position is not supported" );
        }
    } );

    testIframe( "offset/table", "table", function( $, window, document, assert ) {
        assert.expect( 4 );

        assert.equal( $( "#table-1" ).offset().top, 6, "jQuery('#table-1').offset().top" );
        assert.equal( $( "#table-1" ).offset().left, 6, "jQuery('#table-1').offset().left" );

        assert.equal( $( "#th-1" ).offset().top, 10, "jQuery('#th-1').offset().top" );
        assert.equal( $( "#th-1" ).offset().left, 10, "jQuery('#th-1').offset().left" );
    } );

    testIframe( "offset/scroll", "scroll", function( $, win, doc, assert ) {
        assert.expect( 26 );

        assert.equal( $( "#scroll-1" ).offset().top, 7, "jQuery('#scroll-1').offset().top" );
        assert.equal( $( "#scroll-1" ).offset().left, 7, "jQuery('#scroll-1').offset().left" );

        assert.equal( $( "#scroll-1-1" ).offset().top, 11, "jQuery('#scroll-1-1').offset().top" );
        assert.equal( $( "#scroll-1-1" ).offset().left, 11, "jQuery('#scroll-1-1').offset().left" );

        // These tests are solely for master/compat consistency
        // Retrieving offset on disconnected/hidden elements is not officially
        // valid input, but will return zeros for back-compat
        assert.equal( $( "#hidden" ).offset().top, 0, "Hidden elements do not subtract scroll" );
        assert.equal( $( "#hidden" ).offset().left, 0, "Hidden elements do not subtract scroll" );

        // scroll offset tests .scrollTop/Left
        assert.equal( $( "#scroll-1" ).scrollTop(), 5, "jQuery('#scroll-1').scrollTop()" );
        assert.equal( $( "#scroll-1" ).scrollLeft(), 5, "jQuery('#scroll-1').scrollLeft()" );

        assert.equal( $( "#scroll-1-1" ).scrollTop(), 0, "jQuery('#scroll-1-1').scrollTop()" );
        assert.equal( $( "#scroll-1-1" ).scrollLeft(), 0, "jQuery('#scroll-1-1').scrollLeft()" );

        // scroll method chaining
        assert.equal( $( "#scroll-1" ).scrollTop( undefined ).scrollTop(), 5, ".scrollTop(undefined) is chainable (#5571)" );
        assert.equal( $( "#scroll-1" ).scrollLeft( undefined ).scrollLeft(), 5, ".scrollLeft(undefined) is chainable (#5571)" );

        win.name = "test";

        if ( !window.supportsScroll ) {
            assert.ok( true, "Browser doesn't support scroll position." );
            assert.ok( true, "Browser doesn't support scroll position." );

            assert.ok( true, "Browser doesn't support scroll position." );
            assert.ok( true, "Browser doesn't support scroll position." );
        } else {
            assert.equal( $( win ).scrollTop(), 1000, "jQuery(window).scrollTop()" );
            assert.equal( $( win ).scrollLeft(), 1000, "jQuery(window).scrollLeft()" );

            assert.equal( $( win.document ).scrollTop(), 1000, "jQuery(document).scrollTop()" );
            assert.equal( $( win.document ).scrollLeft(), 1000, "jQuery(document).scrollLeft()" );
        }

        // test jQuery using parent window/document
        // jQuery reference here is in the iframe
        window.scrollTo( 0, 0 );
        assert.equal( $( window ).scrollTop(), 0, "jQuery(window).scrollTop() other window" );
        assert.equal( $( window ).scrollLeft(), 0, "jQuery(window).scrollLeft() other window" );
        assert.equal( $( document ).scrollTop(), 0, "jQuery(window).scrollTop() other document" );
        assert.equal( $( document ).scrollLeft(), 0, "jQuery(window).scrollLeft() other document" );

        // Tests scrollTop/Left with empty jquery objects
        assert.notEqual( $().scrollTop( 100 ), null, "jQuery().scrollTop(100) testing setter on empty jquery object" );
        assert.notEqual( $().scrollLeft( 100 ), null, "jQuery().scrollLeft(100) testing setter on empty jquery object" );
        assert.notEqual( $().scrollTop( null ), null, "jQuery().scrollTop(null) testing setter on empty jquery object" );
        assert.notEqual( $().scrollLeft( null ), null, "jQuery().scrollLeft(null) testing setter on empty jquery object" );
        assert.strictEqual( $().scrollTop(), undefined, "jQuery().scrollTop() testing getter on empty jquery object" );
        assert.strictEqual( $().scrollLeft(), undefined, "jQuery().scrollLeft() testing getter on empty jquery object" );
    } );

    describe('body', function () {
        beforeEach(function () {
            document.body.innerHTML = window.__html__['test/body.html'];
        });
        it("offset", function() {
            assert.expect( 4 );

            assert.equal( offset(document.body).top, 1, "offset(document.body).top" );
            assert.equal( offset(document.body).left, 1, "offset(document.body).left" );
            assert.equal( document.querySelector( "#firstElement" ).offsetLeft, 5, "$('#firstElement').position().left" );
            assert.equal( document.querySelector( "#firstElement" ).offsetTop, 5, "$('#firstElement').position().top" );
        } );
    });

    it( "chaining", function () {
        assert.expect( 3 );

        var coords = { "top":  1, "left":  1 };
        var absolute1 = document.querySelector("#absolute-1");
        var nonExistent = document.querySelector("#non-existent");
        assert.equal( offset(absolute1, coords ), absolute1, "offset(coords) returns original element" );
        assert.equal( offset(undefined), undefined, "offset(undefined) returns undefined");
        assert.equal( offset(absolute1, undefined ), absolute1, "offset(undefined) returns original element (#5571)" );
    } );

    it( "fractions (see #7730 and #7885)", function () {
        assert.expect( 2 );

        var fractions = document.createElement('div');
        fractions.id = 'fractions';
        document.body.appendChild(fractions);

        var    expected = { "top": 1000, "left": 1000 };
        var    div = fractions;
        var result;

        div.style.position = "absolute";
        div.style.left = "1000.7432222px";
        div.style.top = "1000.532325px";
        div.style.width = "100px";
        div.style.height = "100px";
        offset(div, expected );
        result = offset(div);

        // Support: Chrome <=45 - 46
        // In recent Chrome these values differ a little.
        assert.ok( Math.abs( result.top - expected.top ) < 0.25, result.top + " within 0.25 of " + expected.top + "." );
        assert.ok( Math.abs( result.left - expected.left ) < 0.25, result.left + " within 0.25 of " + expected.left + "." );

        div.remove();
    } );

    QUnit.test( "iframe scrollTop/Left (see gh-1945)", function () {
        assert.expect( 2 );

        var ifDoc = jQuery( "#iframe" )[ 0 ].contentDocument;

        // Mobile Safari resize the iframe by its content meaning it's not possible to scroll
        // the iframe but only its parent element.
        // It seems (not confirmed) in android 4.0 it's not possible to scroll iframes from the code.
        if ( /iphone os/i.test( navigator.userAgent ) ||
            /android 4\.0/i.test( navigator.userAgent ) ) {
            assert.equal( true, true, "Can't scroll iframes in this environment" );
            assert.equal( true, true, "Can't scroll iframes in this environment" );

        } else {

            // Tests scrollTop/Left with iframes
            jQuery( "#iframe" ).css( "width", "50px" ).css( "height", "50px" );
            ifDoc.write( "<div style='width: 1000px; height: 1000px;'></div>" );

            jQuery( ifDoc ).scrollTop( 200 );
            jQuery( ifDoc ).scrollLeft( 500 );

            assert.equal( jQuery( ifDoc ).scrollTop(), 200, "$($('#iframe')[0].contentDocument).scrollTop()" );
            assert.equal( jQuery( ifDoc ).scrollLeft(), 500, "$($('#iframe')[0].contentDocument).scrollLeft()" );
        }
    } );
});
