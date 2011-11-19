#!/usr/bin/env ruby
require 'rubygems'
require 'rubygame'
include Rubygame

# Set up automatic loading of images and sounds
# Use the __FILE__ special variable to get the
# location of the current file being run.
resources_dir = File.dirname( __FILE__ ) + "/data"
Surface.autoload_dirs = [ resources_dir ]

def main_loop
  screen = Screen.new [640, 480]
  queue = EventQueue.new
  clock = Clock.new
  clock.target_framerate = 30

  # Load the background.png file into a surface.
  # Note that background.png is actually in the
  # data directory, but the data directory is in
  # the autoload path, so Rubygame will find it.
  background = Surface['background.png']

  loop do
    clock.tick

    queue.each do|e|
      return if e.is_a? QuitEvent
    end

    # Draw the background onto the screen
    background.blit( screen, [0,0] )

    # Show the screen on the monitor
    screen.update
  end

ensure
  Rubygame.quit
end

if $0 == __FILE__
  main_loop
end
