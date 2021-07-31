#!/usr/bin/env ruby

# CSV family feud parse
# expects:
# Question, answer1, pnt1, answer2, pnt2   
# or
# Question, answer1, answer2  <-- in point_generator mode

# outputs a large amount of games in cold_family_feud .json format
# giving a list of .csv files matching the csv format above


require 'csv'
require 'json'
require_relative 'point_generator'

class CSVParser 
  attr_accessor :fastmoney, :rounds, :random, :multiplier, :ignore_header, :verbose, :files, :filename, :target
  @@round_arr = []
  @@file_arr = []

  def initialize(params = {})
    @fastmoney = params.fetch(:fastmoney, true)
    @rounds = params.fetch(:rounds, 6)
    @files = params.fetch(:files, [])
    @random = params.fetch(:random, true)
    @multiplier = params.fetch(:multiplier, true)
    @ignore_header = params.fetch(:ignore_header, false)
    @verbose = params.fetch(:verbose, false)
    @filename = params.fetch(:filename, "game_")
    @target = params.fetch(:target, "./")
  end

  # debug output
  def dp(output)
    if verbose
      p output
    end
  end

  # use point generator lib to
  # get random point values and insert
  # them into the correct place in the array
  def attach_points(round)
    num_answers = round.length() - 1
    gen = Generator.new({ number: num_answers })
    gen_points = gen.run
    i = 0
    until i > gen_points.length()
      unless gen_points[i].nil?
        round.insert(i + i + 2, gen_points[i])
      end
      i += 1
    end
    return round
  end

  # detect pattern coming from csv
  # push value if its in a correct format
  # if there no points then generate
  def propagate_rounds(round)
    i = 0
    case round
      in [String, String, Integer, *]
      # "Question, Answer, Points"
      @@round_arr.push(round)
      in [String, Integer, Integer, *]
      # "Question, Answer, Points - Answer is integer"
      @@round_arr.push(round)
      in [String, String, String, *]
      # "Question, Answer, Answer"
      new_round = attach_points(round)
      @@round_arr.push(round)
    else
      p "no match"
    end
  end

  # after gathering up rows 
  # create games using cold family feud format
  #
  # using round number + fast money (4 questions)
  # create as many games as possible until we run out
  def createFamilyJson
    if @random
      @@round_arr = @@round_arr.shuffle
    end
    q = 0
    fm = 0
    counter = 0
    fm_rounds = 0
    if @fastmoney
      fm_rounds = 4
    end

    if @fastmoney
      game = {
        rounds: [],
        final_round: [],
        final_round_timers: [20, 25]
      }
    else
      game = {
        rounds: [],
      }
    end

    dp @@round_arr.length()
    # push an empty value for value that is even to rounds + fast money
    @@round_arr.push(nil)

    game_num = ( @@round_arr.length() / (@rounds + fm_rounds) )
    game_num.to_i

    for r in @@round_arr
      if counter == game_num
        unless r.nil?
          p "could not use in a full game with #{@rounds} rounds + #{fm_rounds} fast money rounds => #{r[0]}"
        end
        next
      end

      if q < @rounds
        dp "q => #{q} r => #{r[0]}"
        # add in a round
        i = 0
        round_hash = {
          answers: [],
          multiply: q >= (@rounds / 2).to_int && @multiplier ? 2 : 1
        }
        until i > r.length()
          if i == 0
            round_hash["question"] = r[i]
            i += 1
            next
          end

          if i % 2 == 0
            round_hash[:answers].push({
              "ans": r[i-1], "pnt": r[i], "trig": false 
            })
          end

          i += 1
        end
        game[:rounds].push(round_hash)
        q += 1
      else if q == @rounds and @fastmoney and fm  < fm_rounds
        dp "fm => #{fm} r => #{r[0]}"
        # add in a fast money round
        i = 0
        round_hash = {
          answers: [],
          selection: 0,
          points: 0,
          input: "",
          revealed: false
        }
        until i > r.length()
          if i == 0
            round_hash["question"] = r[0]
            i += 1
            next
          end

          if i % 2 == 0
            round_hash[:answers].push([r[i-1], r[i]])
          end
          i += 1
        end
        game[:final_round].push(round_hash)

        fm += 1
      else
        unless r.nil?
          dp "reusing #{r[0]} in the next loop"
        end
        q = 0
        fm = 0
        # push game to files
        @@file_arr.push(game)
        counter += 1
        dp "#{@@file_arr.length()}"

        # clear game 
        if @fastmoney
          game = {
            rounds: [],
            final_round: [],
            final_round_timers: [20, 25]
          }
        else
          game = {
            rounds: [],
          }
        end
        redo
      end
    end
  end
  dp "Number of games => #{@@file_arr.length()}"
end

def saveFiles(file_arr)
  i = 0
  until i >= file_arr.length()
    file_name = "#{@filename}#{i}.json"
    p "Saving #{target}#{file_name}"
    contents = JSON.pretty_generate(file_arr[i])
    File.open("#{@target}#{file_name}", 'w') {
      |file| file.write(contents)
    }
    i += 1
  end
end

def parse
  for file in files
    if file.include? ".csv"
      arr_of_rows = CSV.read(file, converters: :all)
      $j = 0
      until $j > arr_of_rows.length()
        if ignore_header and $j == 0
          dp "ignore header -> #{file}"
          $j +=1;
          next
        end

        round = {}
        row = arr_of_rows[$j]
        $i = 0
        unless row.nil?
          propagate_rounds(row)
        end
        $j +=1;
      end
    else
      raise "#{file} is not a .csv file"
    end
  end
  createFamilyJson()
  return @@file_arr
end
end

