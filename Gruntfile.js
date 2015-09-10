module.exports = function(grunt) {

    grunt.initConfig({
        //    pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'src/lib/Long.js',
                    'src/lib/jszip.js',
                    'src/lib/proj4-src.js',
                    'src/lib/ejs.js',
                    'src/lib/EventEmitter.js',
                    'src/lib/pixi.js',
                    'src/lib/lru-cache.js',
                    'src/lib/async.js',
                    'citrongis-core/src/index.js',
                    'citrongis-core/src/utils/Comparison.js',
                    'citrongis-core/src/utils/Intersection.js',
                    'citrongis-core/src/utils/Inheritance.js',
                    'citrongis-core/src/utils/Object.js',
                    'citrongis-core/src/utils/Context.js',
                    'citrongis-core/src/utils/Path.js',
                    'citrongis-core/src/utils/Event.js',
                    'citrongis-core/src/geometry/Point.js',
                    'citrongis-core/src/geometry/Vector2.js',
                    'citrongis-core/src/geometry/Vector3.js',
                    'citrongis-core/src/geometry/BoundingBox.js',
                    'citrongis-core/src/geometry/Extent.js',
                    'citrongis-core/src/geometry/Rectangle.js',
                    'citrongis-core/src/system/Viewport.js',
                    'citrongis-core/src/helpers/CoordinatesHelper.js',
                    'citrongis-core/src/helpers/ProjectionsHelper.js',
                    'citrongis-core/src/helpers/IntersectionHelper.js',
                    'citrongis-core/src/helpers/ResolutionHelper.js',
                    'citrongis-core/src/helpers/RendererHelper.js',
                    'citrongis-core/src/extension/URLHandler.js',
                    'citrongis-core/src/extension/Require.js',
                    'citrongis-core/src/extension/ui/Include.js',
                    'citrongis-core/src/extension/ui/trigger.js',
                    'citrongis-core/src/extension/ui/Bridge.js',
                    'citrongis-core/src/extension/ui/UI.js',
                    'citrongis-core/src/extension/Module.js',
                    'citrongis-core/src/extension/Extension.js',
                    'citrongis-core/src/extension/Manager.js',
                    'citrongis-core/src/geometry/LatLng.js',
                    'citrongis-core/src/geo/feature/Feature.js',
                    'citrongis-core/src/geo/feature/Circle.js',
                    'citrongis-core/src/geo/feature/Image.js',
                    'citrongis-core/src/geo/feature/Line.js',
                    'citrongis-core/src/geo/feature/Polygon.js',
                    'citrongis-core/src/geo/Layer.js',
                    'citrongis-core/src/layer/tile/TileIndex.js',
                    'citrongis-core/src/layer/tile/TileSchema.js',
                    'citrongis-core/src/layer/tile/Schema/SphericalMercator.js',
                    'citrongis-core/src/layer/tile/Source/TileSource.js',
                    'citrongis-core/src/layer/tile/Source/TMSSource.js',
                    'citrongis-core/src/layer/tile/TileLayer.js',
                    'citrongis-core/src/extension/LayerGroup.js',
                    'citrongis-core/src/extension/LayerManager.js',
                    'citrongis-core/src/extension/LayerHelper.js',
                    'citrongis-core/src/schema/SchemaBase.js',
                    'citrongis-core/src/schema/SphericalMercator.js',
                    'citrongis-core/src/system/Events.js',
                    'citrongis-core/src/system/TileSchemaManager.js',
                    'citrongis-core/src/renderer/RendererBase.js',
                    'citrongis-core/src/ui/PopupManager.js',
                    'citrongis-core/src/ui/Popup.js'
                ],
                dest: 'build/citrongis-core.js'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    'build/citrongis-core.min.js': ['build/citrongis-core.js']
                }
            }
        },
        //    qunit: {
        //      files: ['test/**/*.html']
        //    },
        //    jshint: {
        //      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        //      options: {
        //        // options here to override JSHint defaults
        //        globals: {
        //          jQuery: true,
        //          console: true,
        //          module: true,
        //          document: true
        //        }
        //      }
        //    },
        //    watch: {
        //      files: ['<%= jshint.files %>'],
        //      tasks: ['jshint', 'qunit']
        //    }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    //  grunt.loadNpmTasks('grunt-contrib-jshint');
    //  grunt.loadNpmTasks('grunt-contrib-qunit');
    //  grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    //  grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.registerTask('default', [/*'jshint', 'qunit', */'concat', 'uglify']);

};
